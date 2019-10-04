/* eslint-disable camelcase */
/**
 * Customer controller handles all requests that has to do with customer
 * Some methods needs to be implemented from scratch while others may contain one or two bugs
 *
 * - create - allow customers to create a new account
 * - login - allow customers to login to their account
 * - getCustomerProfile - allow customers to view their profile info
 * - updateCustomerProfile - allow customers to update their profile info like name, email, password, day_phone, eve_phone and mob_phone
 * - updateCustomerAddress - allow customers to update their address info
 * - updateCreditCard - allow customers to update their credit card number
 *
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
import { Customer } from '../database/models';
import {
  USER_ALREADY_EXISTS,
  UNAUTHORISED_LOGIN,
  INVALID_CREDIT_CARD_UPDATE,
} from '../utils/constants';
import { creditCardValidator } from '../utils/validators/creditcard.validator';
/**
 *
 *
 * @class CustomerController
 */
class CustomerController {
  /**
   * create a customer record
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, customer data and access token
   * @memberof CustomerController
   */
  static async create(req, res, next) {
    // check if customer exists
    const { email, name, password } = req.user;
    const [customer, created] = await Customer.findOrCreate({
      where: { email },
      defaults: { name, password },
    });
    if (!created) {
      // the user exists in the database
      return res.status(400).send(USER_ALREADY_EXISTS);
    }
    const { customer_id, shipping_region_id } = customer;
    const { accessToken, expiresIn } = customer.toAuthJson();
    const response = {
      customer: { customer_id, shipping_region_id, name: customer.name, email: customer.email },
      accessToken,
      expiresIn,
    };
    return res.status(201).json(response);
  }

  /**
   * log in a customer
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, and access token
   * @memberof CustomerController
   */
  static async login(req, res, next) {
    // implement function to login to user account
    const { email, password } = req.user;
    const customer = await Customer.findOne({
      where: { email },
    });
    if (!customer) {
      // customer does not exist in database
      return res.status(400).send(UNAUTHORISED_LOGIN);
    }
    const passwordMatch = await customer.validatePassword(password);
    if (!passwordMatch) {
      // invalid password
      return res.status(400).send(UNAUTHORISED_LOGIN);
    }
    const customerResponse = { ...customer.dataValues };
    delete customerResponse.password;
    const { accessToken, expiresIn } = customer.toAuthJson();
    const response = {
      customer: customerResponse,
      accessToken,
      expiresIn,
    };
    return res.status(200).json(response);
  }

  /**
   * get customer profile data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async getCustomerProfile(req, res, next) {
    // fix the bugs in this code
    const { customer_id } = req; // eslint-disable-line
    try {
      const customer = await Customer.findByPk(customer_id, {
        attributes: { exclude: ['password'] },
      });
      return res.status(200).json(customer);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer profile data such as name, email, password, day_phone, eve_phone and mob_phone
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCustomerProfile(req, res, next) {
    // Implement function to update customer profile like name, day_phone, eve_phone and mob_phone
    const { customer_id, user } = req; // eslint-disable-line
    if (
      user.email &&
      (await Customer.findOne({
        where: { email: user.email },
        exclude: ['password', 'credit_card'],
      }))
    ) {
      // the email provided exists in the db
      return res.status(400).json(USER_ALREADY_EXISTS);
    }
    try {
      const customer = await Customer.findByPk(customer_id, {
        attributes: { exclude: ['password'] },
      });
      const updatedCustomer = await customer.update(user);
      return res.status(200).json(updatedCustomer);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer profile data such as address_1, address_2, city, region, postal_code, country and shipping_region_id
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCustomerAddress(req, res, next) {
    // the customer_id and user objects are placed on the request
    // by the authentication and validation middleware
    const { customer_id, user } = req; // eslint-disable-line
    try {
      const customer = await Customer.findByPk(customer_id, {
        attributes: { exclude: ['password'] },
      });
      const updatedCustomer = await customer.update(user);
      return res.status(200).json(updatedCustomer);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer credit card
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCreditCard(req, res, next) {
    // the customer_id and credit_card objects are placed on the request
    // by the authentication and validation middleware
    const {
      customer_id,
      credit_card: { credit_card },
    } = req; // eslint-disable-line
    // validate credit card using card validator
    if (!creditCardValidator(credit_card)) {
      // the card number provided is not valid
      return res.status(400).json(INVALID_CREDIT_CARD_UPDATE);
    }
    try {
      const customer = await Customer.findByPk(customer_id, {
        attributes: { exclude: ['password'] },
      });
      const updatedCustomer = await customer.update({ credit_card });
      return res.status(200).json(updatedCustomer);
    } catch (error) {
      return next(error);
    }
  }
}

export default CustomerController;
