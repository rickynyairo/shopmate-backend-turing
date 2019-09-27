/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/**
 * Check each method in the shopping cart controller and add code to implement
 * the functionality or fix any bug.
 * The static methods and their function include:
 *
 * - generateUniqueCart - To generate a unique cart id
 * - addItemToCart - To add new product to the cart
 * - getCart - method to get list of items in a cart
 * - updateCartItem - Update the quantity of a product in the shopping cart
 * - emptyCart - should be able to clear shopping cart
 * - removeItemFromCart - should delete a product from the shopping cart
 * - createOrder - Create an order
 * - getCustomerOrders - get all orders of a customer
 * - getOrderSummary - get the details of an order
 * - processStripePayment - process stripe payment
 *
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
import uuidv1 from 'uuid/v1';
import { ShoppingCart, Tax, Shipping, Product, Order, Customer } from '../database/models';
import { NOT_FOUND } from '../utils/constants';
/**
 *
 *
 * @class shoppingCartController
 */
class ShoppingCartController {
  /**
   * generate random unique id for cart identifier
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart_id
   * @memberof shoppingCartController
   */
  static generateUniqueCart(req, res) {
    // implement method to generate unique cart Id
    const cart_id = uuidv1().substring(0, 32);
    return res.status(200).json({ cart_id });
  }

  /**
   * adds item to a cart with cart_id
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async addItemToCart(req, res, next) {
    // implement function to add item
    try {
      const { item } = req;
      const savedItem = await ShoppingCart.create(item);
      return res.status(201).json(savedItem);
    } catch (error) {
      return next();
    }
  }

  /**
   * get shopping cart using the cart_id
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async getCart(req, res, next) {
    try {
      const { cart_id } = req.params;
      const cartItems = await ShoppingCart.findAll({ where: { cart_id } });
      return cartItems.length > 0
        ? res.status(200).json(cartItems)
        : res.status(404).json(NOT_FOUND);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update cart item quantity using the item_id in the request param
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async updateCartItem(req, res, next) {
    try {
      // item and quantity are inserted in the request object by middleware
      // item is inserted by the getObjectOr404 middleware
      // quantity is inserted by the validation middleware
      const { item, quantity } = req;
      const newItem = await item.update(quantity);
      return res.status(200).json(newItem);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * removes all items in a cart
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async emptyCart(req, res, next) {
    try {
      const { cart_id } = req.params;
      const deleted = await ShoppingCart.destroy({ where: { cart_id } });
      return deleted
        ? res.status(200).json({ message: 'Shopping cart removed successfully' })
        : res.status(404).json(NOT_FOUND);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * remove single item from cart
   * cart id is obtained from current session
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with message
   * @memberof ShoppingCartController
   */
  static async removeItemFromCart(req, res, next) {
    try {
      const { item_id } = req.params;
      const deleted = await ShoppingCart.destroy({ where: { item_id } });
      return deleted
        ? res.status(200).json({ message: 'Product successfully removed from cart' })
        : res.status(404).json(NOT_FOUND);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * create an order from a cart
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with created order
   * @memberof ShoppingCartController
   */
  static async createOrder(req, res, next) {
    try {
      const { cart_id, shipping_id, tax_id } = req.order;
      const { customer_id } = req;
      const cartItems = await ShoppingCart.findAll({ where: { cart_id } });
      const { tax_percentage } = await Tax.findByPk(tax_id);
      const { shipping_cost } = await Shipping.findByPk(shipping_id);
      let total_amount = 0;
      for (const item of cartItems) {
        const { price } = await Product.findByPk(item.product_id);
        const itemCost = price * item.quantity;
        total_amount += itemCost;
      }
      // add taxes and shipping cost
      total_amount += Number(shipping_cost) + (total_amount * Number(tax_percentage)) / 100;
      const { order_id } = await Order.create({
        auth_code: uuidv1(),
        reference: cart_id,
        total_amount,
        customer_id,
        shipping_id,
        tax_id,
      });
      return res.status(201).json({ order_id });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with customer's orders
   * @memberof ShoppingCartController
   */
  static async getCustomerOrders(req, res, next) {
    // eslint-disable-line
    try {
      const { customer_id } = req;
      const { name } = await Customer.findByPk(customer_id);
      const orders = await Order.findAll({ where: { customer_id } });
      const response = [];
      for (const order of orders) {
        const { order_id, created_on, shipped_on, total_amount } = order;
        response.push({ order_id, total_amount, created_on, shipped_on, name });
      }
      return res.status(200).send(response);
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with order summary
   * @memberof ShoppingCartController
   */
  static async getOrderSummary(req, res, next) {
    try {
      const { order_id, reference } = req.order;
      const cartItems = await ShoppingCart.findAll({ where: { cart_id: reference } });
      const order_items = [];
      for (const item of cartItems) {
        const { product_id, attributes, quantity } = item;
        const { product_name, price } = await Product.findByPk(product_id);
        order_items.push({
          product_id,
          attributes,
          product_name,
          quantity,
          unit_cost: price,
          subtotal: quantity * price,
        });
      };
      return res.status(200).json({ order_id, order_items });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with customer's orders
   * @memberof ShoppingCartController
   */
  static async getOrderShortDetails(req, res, next) {
    // eslint-disable-line
    try {
      // customer id and order are placed in the request object by middleware
      const { customer_id, order } = req;
      const { order_id, total_amount, created_on, shipped_on } = order;
      const { name } = await Customer.findByPk(customer_id);
      return res.status(200).send({ order_id, total_amount, created_on, shipped_on, name });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async processStripePayment(req, res, next) {
    const { email, stripeToken, order_id } = req.body; // eslint-disable-line
    const { customer_id } = req; // eslint-disable-line
    try {
      // implement code to process payment and send order confirmation email here
    } catch (error) {
      return next(error);
    }
  }
}

export default ShoppingCartController;
