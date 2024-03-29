import { Router } from 'express';
import ShoppingCartController from '../../controllers/shoppingCart.controller';
import { requestValidation } from '../../middleware/validation';
import { jwtAuthRequired } from '../../middleware/authentication';
import { INVALID_CART_ITEM, INVALID_ORDER, INVALID_CHARGE } from '../../utils/constants';
import { cartItemSchema, orderSchema } from '../../utils/validators/shoppingCart.validators';
import { getObjectOr404 } from '../../middleware/finder';
import { ShoppingCart, Order } from '../../database/models';
import { stripeChargeSchema } from '../../utils/validators/stripe.validator';

const router = Router();
// use jwt authentication middleware for all shoppingcart routes
router.use('/shoppingcart', jwtAuthRequired);
router.get('/shoppingcart/generateUniqueId', ShoppingCartController.generateUniqueCart);
router.get('/shoppingcart/:cart_id', ShoppingCartController.getCart);
router.delete('/shoppingcart/empty/:cart_id', ShoppingCartController.emptyCart);
router.delete('/shoppingcart/removeProduct/:item_id', ShoppingCartController.removeItemFromCart);
router.post(
  '/shoppingcart/add',
  requestValidation('item', cartItemSchema, INVALID_CART_ITEM),
  ShoppingCartController.addItemToCart
);
router.put(
  '/shoppingcart/update/:item_id',
  requestValidation('quantity', cartItemSchema, INVALID_CART_ITEM),
  getObjectOr404('item', ShoppingCart),
  ShoppingCartController.updateCartItem
);
// use jwt auth middleware for all order routes
router.use('/orders', jwtAuthRequired);
router.get('/orders/inCustomer', ShoppingCartController.getCustomerOrders);
router.post(
  '/orders',
  requestValidation('order', orderSchema, INVALID_ORDER),
  ShoppingCartController.createOrder
);
router.get(
  '/orders/:order_id',
  getObjectOr404('order', Order),
  ShoppingCartController.getOrderSummary
);
router.get(
  '/orders/shortDetails/:order_id',
  getObjectOr404('order', Order),
  ShoppingCartController.getOrderShortDetails
);
router.post(
  '/stripe/charge',
  jwtAuthRequired,
  requestValidation('charge', stripeChargeSchema, INVALID_CHARGE),
  ShoppingCartController.processStripePayment
);
export default router;
