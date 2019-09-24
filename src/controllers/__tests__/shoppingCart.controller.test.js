// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import truncate from '../../test/helpers';

describe('Shopping Cart Controller', () => {
  // let shoppingCart;
  // let shoppingCartId;
  let accessToken;
  beforeEach(async done => {
    await truncate();

    const customer = {
      name: 'test customer',
      password: 'password',
      email: 'test_customer@email.com',
    };
    const response = await request(app)
      .post('/customers/signup')
      .set('Content-Type', 'application/json')
      .send(customer);
    // eslint-disable-next-line prefer-destructuring
    accessToken = response.body.accessToken;
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
});
