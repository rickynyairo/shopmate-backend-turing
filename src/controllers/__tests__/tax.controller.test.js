/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';
import { Tax } from '../../database/models';
import app, { server } from '../..';
import truncate from '../../test/helpers';

describe('Tax Controller', () => {
  let accessToken;
  let tax;
  beforeAll(async done => {
    await truncate();
    const customer = {
      name: 'test customer',
      password: 'password',
      email: 'test_customer@email.com',
    };
    tax = await Tax.create({
      tax_type: 'Test Region',
      tax_percentage: 5.0,
    });
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

  describe('Get all taxes', () => {
    it('should get all taxes', done => {
      request(app)
        .get('/tax')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('taxes');
          expect(res.body.taxes.length).toBeGreaterThan(0);
          done();
        });
    });
  });
  describe('Get a single tax', () => {
    it('should get a single tax based on the id', done => {
      request(app)
        .get(`/tax/${tax.tax_id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('tax');
          expect(res.body.tax.tax_id).toEqual(tax.tax_id);
          done();
        });
    });
  });
});
