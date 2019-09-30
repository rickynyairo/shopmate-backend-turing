/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';
import {
  Order,
  OrderDetail,
  Product,
  Shipping,
  ShippingRegion,
  ShoppingCart,
  Tax,
} from '../../database/models';
import app, { server } from '../..';
import truncate from '../../test/helpers';

describe('Order Controller', () => {
  let accessToken;
  let product;
  let customer;
  let shipping;
  let tax;
  let order;
  const cart_id = 'a3bf83f0-df17-11e9-a936-61dae1df';
  beforeAll(async done => {
    await truncate();
    product = await Product.create({
      name: 'Test Product',
      description: 'A test product',
      price: 500,
    });
    await ShoppingCart.create({
      cart_id,
      product_id: product.product_id,
      attributes: 'various attributes',
      quantity: 2,
    });
    tax = await Tax.create({
      tax_type: 'Test Tax',
      tax_percentage: 5.0,
    });
    // signup customer for access token
    const { body } = await request(app)
      .post('/customers/signup')
      .set('Content-Type', 'application/json')
      .send({
        name: 'test customer',
        password: 'password',
        email: 'test_customer33@email.com',
      });
    customer = body.customer;
    accessToken = body.accessToken;
    const shipping_region = await ShippingRegion.create({
      shipping_region: 'Test Region',
    });
    shipping = await Shipping.create({
      shipping_type: 'Next Day',
      shipping_cost: 10,
      shipping_region_id: shipping_region.shipping_region_id,
    });
    order = await Order.create({
      total_amout: 100.0,
      shipped_on: '2019-01-01 00:00:00',
      comments: 'comments are not required',
      customer_id: customer.customer_id,
      auth_code: 'test101',
      reference: cart_id,
      shipping_id: shipping.shipping_id,
      tax_id: tax.tax_id,
    });
    done();
  });

  afterAll(async done => {
    server.close();
    done();
  });

  describe('Create an order', () => {
    it('should create an order', done => {
      const orderItem = {
        cart_id,
        shipping_id: shipping.shipping_id,
        tax_id: tax.tax_id,
      };
      request(app)
        .post('/orders')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(orderItem)
        .end((error, res) => {
          expect(res.status).toEqual(201);
          expect(res.body).toHaveProperty('order_id');
          done();
        });
    });
    it('should calculate total amount correctly including tax', done => {
      const orderItem = {
        cart_id,
        shipping_id: shipping.shipping_id,
        tax_id: tax.tax_id,
      };
      request(app)
        .post('/orders')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(orderItem)
        .end(async (error, { status, body }) => {
          expect(status).toEqual(201);
          const pk = body.order_id;
          const test_order = await Order.findByPk(pk);
          expect(Number(test_order.total_amount)).toEqual(1060);
          done();
        });
    });
  });
  describe('Get order summary', () => {
    it('should get an order using the order_id', done => {
      request(app)
        .get(`/orders/${order.order_id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('order_id');
          expect(res.body.order_id).toEqual(order.order_id);
          expect(res.body).toHaveProperty('order_items');
          expect(res.body.order_items.length).toBeGreaterThan(0);
          done();
        });
    });
  });
  describe('Get customers orders', () => {
    it('should get all the orders made by a customer', done => {
      request(app)
        .get(`/orders/inCustomer`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('length');
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0].name).toEqual('test customer');
          done();
        });
    });
  });
  describe('Get order short details', () => {
    it('should get short details of an order using the order_id', done => {
      request(app)
        .get(`/orders/shortDetails/${order.order_id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, { body, status }) => {
          expect(status).toEqual(200);
          expect(body).toHaveProperty('order_id');
          expect(body.order_id).toEqual(order.order_id);
          expect(body).toHaveProperty('name');
          expect(body.name).toEqual(customer.name);
          done();
        });
    });
  });
});
