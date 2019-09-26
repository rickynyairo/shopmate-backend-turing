/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';
import { ShoppingCart, Product } from '../../database/models';
import app, { server } from '../..';
import truncate from '../../test/helpers';

describe('Shopping Cart Controller', () => {
  // let shoppingCart;
  // let shoppingCartId;
  let accessToken;
  let item_id;
  const cart_id = 'a3bf83f0-df17-11e9-a936-61dae1df';
  let product;
  beforeAll(async done => {
    await truncate();
    const customer = {
      name: 'test customer',
      password: 'password',
      email: 'test_customer@email.com',
    };
    product = await Product.create({
      name: 'Test Product',
      description: 'A test product',
      price: 5,
    });
    const item = {
      cart_id,
      product_id: product.product_id,
      attributes: 'various attributes',
      quantity: 2,
    };
    // signup customer for access token
    const response = await request(app)
      .post('/customers/signup')
      .set('Content-Type', 'application/json')
      .send(customer);
    accessToken = response.body.accessToken;
    // add 3 items to the cart
    // eslint-disable-next-line no-plusplus
    await ShoppingCart.create(item);
    const newItem = await ShoppingCart.create(item);
    item_id = newItem.item_id;
    done();
  });

  afterAll(async done => {
    server.close();
    done();
  });

  describe('Generate Unique Id', () => {
    it('should generate a unique shopping cart id for each authenticated user', done => {
      request(app)
        .get('/shoppingcart/generateUniqueId')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('cart_id');
          done();
        });
    });
    it('should not generate a unique id for an unauthenticated user', done => {
      request(app)
        .get('/shoppingcart/generateUniqueId')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer faketoken`)
        .end((error, res) => {
          expect(res.status).toEqual(401);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          done();
        });
    });
  });
  describe('Add and get from shopping cart', () => {
    it("should add items to a customer's shopping cart", done => {
      const item = {
        product_id: product.product_id,
        attributes: 'various attributes',
        quantity: 2,
        cart_id,
      };
      // add items to provided cart_id
      request(app)
        .post('/shoppingcart/add')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(item)
        .end((error, res) => {
          expect(res.status).toEqual(201);
          expect(res.body).toHaveProperty('item_id');
          expect(res.body.cart_id).toEqual(cart_id);
          done();
        });
    });
    it('should get items in shopping cart using cart_id', done => {
      request(app)
        .get(`/shoppingcart/${cart_id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body[0]).toHaveProperty('cart_id');
          expect(res.body[0].cart_id).toEqual(cart_id);
          done();
        });
    });
  });
  describe('Update Item quantity or remove item', () => {
    it('should update the quantity of a product in the cart', done => {
      const quantity = 5;
      request(app)
        .put(`/shoppingcart/update/${item_id}`)
        .set('Content-Type', 'application/json')
        .send({ quantity: 5 })
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, { status, body }) => {
          expect(status).toEqual(200);
          expect(body).toHaveProperty('item_id');
          expect(body.item_id).toEqual(item_id);
          expect(body.quantity).toEqual(quantity);
          done();
        });
    });
    it('should return an error message if item does not exist', done => {
      request(app)
        .put(`/shoppingcart/update/1234567`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ quantity: 5 })
        .end((error, { status, body }) => {
          expect(status).toEqual(404);
          expect(body).toHaveProperty('error');
          expect(body.error).toHaveProperty('message');
          expect(body.error.message).toEqual('The requested resource was not found on the server');
          done();
        });
    });
    it('should remove an item from the cart', done => {
      request(app)
        .delete(`/shoppingcart/removeProduct/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, { status, body }) => {
          expect(status).toEqual(200);
          expect(body).toHaveProperty('message');
          expect(body.message).toEqual('Product successfully removed from cart');
          done();
        });
    });
  });
  describe('Empty Cart', () => {
    it('should empty the cart', done => {
      request(app)
        .delete(`/shoppingcart/empty/${cart_id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, { status, body }) => {
          expect(status).toEqual(200);
          expect(body).toHaveProperty('message');
          expect(body.message).toEqual('Shopping cart removed successfully');
          done();
        });
      // should return a 404 if cart does not exist
      request(app)
        .get(`/shoppingcart/empty/${cart_id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, res) => {
          expect(res.status).toEqual(404);
          expect(res.body).toHaveProperty('error');
          done();
        });
    });
  });
});
