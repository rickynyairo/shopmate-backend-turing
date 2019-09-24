import { Router } from 'express';
import ShoppingCartController from '../../controllers/shoppingCart.controller';
import { validationMiddleware } from '../../middleware/validation';
import { jwtAuthRequired } from '../../middleware/authentication';
import { INVALID_CART_ITEM } from '../../utils/constants';
import { cartItemSchema } from '../../utils/validators/shoppingCart.validators';

const router = Router();
// use jwt authentication middleware for all shoppingcart routes
router.use('/shoppingcart', jwtAuthRequired);
router.get('/shoppingcart/generateUniqueId', ShoppingCartController.generateUniqueCart);
router.post(
  '/shoppingcart/add',
  validationMiddleware('item', cartItemSchema, INVALID_CART_ITEM),
  ShoppingCartController.addItemToCart
);
router.get('/shoppingcart/:cart_id', ShoppingCartController.getCart);
router.put('/shoppingcart/update/:item_id', ShoppingCartController.updateCartItem);
router.delete('/shoppingcart/empty/:cart_id', ShoppingCartController.emptyCart);
router.delete('/shoppingcart/removeProduct/:item_id', ShoppingCartController.removeItemFromCart);
router.use('/orders', jwtAuthRequired);
router.post('/orders', ShoppingCartController.createOrder);
router.get('/orders/inCustomer', ShoppingCartController.getCustomerOrders);
router.get('/orders/:order_id', ShoppingCartController.getOrderSummary);
router.post('/stripe/charge', ShoppingCartController.processStripePayment);

export default router;
