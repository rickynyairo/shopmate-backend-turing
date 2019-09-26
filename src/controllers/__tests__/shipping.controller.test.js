/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';
import { Shipping, ShippingRegion } from '../../database/models';
import app, { server } from '../..';
import truncate from '../../test/helpers';

describe('Shopping Cart Controller', () => {
  // let shoppingCart;
  // let shoppingCartId;
  let accessToken;
  let shipping_region;
  let shipping;
  beforeAll(async done => {
    await truncate();
    const customer = {
      name: 'test customer',
      password: 'password',
      email: 'test_customer@email.com',
    };
    shipping_region = await ShippingRegion.create({
      shipping_region: 'Test Region',
    });
    const shipping_type = {
      shipping_type: 'Next Day',
      shipping_cost: 10,
      shipping_region_id: shipping_region.shipping_region_id,
    };
    shipping = Shipping.create(shipping_type);
    // signup customer for access token
    const response = await request(app)
      .post('/customers/signup')
      .set('Content-Type', 'application/json')
      .send(customer);
    accessToken = response.body.accessToken;
    done();
  });

  afterAll(async done => {
    server.close();
    done();
  });

  describe('Get shipping regions', () => {
    it('get all shipping regions', done => {
      request(app)
        .get('/shipping/regions')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('shippingRegions');
          expect(res.body.shippingRegions.length).toBeGreaterThan(0);
          done();
        });
    });
  });
  describe('Get shipping types', () => {
    it('get all shipping types in a shipping region', done => {
      request(app)
        .get(`/shipping/regions/${shipping_region.shipping_region_id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('shippingTypes');
          expect(res.body.shippingTypes.length).toBeGreaterThan(0);
          done();
        });
    });
  });
});
