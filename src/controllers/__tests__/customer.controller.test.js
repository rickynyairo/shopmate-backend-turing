// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import truncate from '../../test/helpers';

describe('Customer Controller', () => {
  let customer;
  let accessToken;
  beforeEach(async done => {
    await truncate();
    customer = {
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

  describe('Signup', () => {
    it('should allow a new user to signup', done => {
      request(app)
        .post('/customers/signup')
        .set('Content-Type', 'application/json')
        .send({
          name: 'new customer',
          password: 'newpassword',
          email: 'new_customer@email.com',
        })
        .end((error, res) => {
          expect(res.status).toEqual(201);
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('customer');
          expect(res.body.customer.name).toEqual('new customer');
          done();
        });
    });
    it('should not allow signing up with duplicate emails', done => {
      request(app)
        .post('/customers/signup')
        .set('Content-Type', 'application/json')
        .send({
          name: 'test customer',
          password: 'password',
          email: 'test_customer@email.com',
        })
        .end((error, res) => {
          expect(res.status).toEqual(400);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error.message).toEqual(
            'The email provided is already in use by another user'
          );
          done();
        });
    });
    it('should not allow signing up with invalid data', done => {
      request(app)
        .post('/customers/signup')
        .set('Content-Type', 'application/json')
        .send({
          name: 'test customer',
          password: 'password',
          email: 'invalid_email.com',
        })
        .end((error, res) => {
          expect(res.status).toEqual(400);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('field');
          done();
        });
    });
  });

  describe('Login', () => {
    it('should allow an authorised user to login', done => {
      request(app)
        .post('/customers/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test_customer@email.com',
          password: 'password',
        })
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('customer');
          expect(res.body.customer.name).toEqual(customer.name);
          done();
        });
    });
    it('should not allow an unauthorised user to login', done => {
      request(app)
        .post('/customers/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test_customer@email.com',
          password: 'invalidpassword',
        })
        .end((error, res) => {
          expect(res.status).toEqual(400);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual(
            'The email and password combination provided is invalid'
          );
          done();
        });
    });
    it('should validate both email and password', done => {
      request(app)
        .post('/customers/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'invalid_customer@email.com',
          password: 'password',
        })
        .end((error, res) => {
          expect(res.status).toEqual(400);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual(
            'The email and password combination provided is invalid'
          );
          done();
        });
      // test email validattion
      request(app)
        .post('/customers/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'invalid_email.com',
          password: 'password',
        })
        .end((error, res) => {
          expect(res.status).toEqual(400);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          done();
        });
    });
  });
  describe('Profile', () => {
    it('should return the profile of an authenticated user', done => {
      request(app)
        .get('/customer')
        .set('Authorization', `Bearer ${accessToken}`)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('customer_id');
          expect(res.body.name).toEqual(customer.name);
          done();
        });
    });
    it('should not return the profile of an unauthorised user', done => {
      request(app)
        .get('/customer')
        .set('Authorization', `Bearer faketoken`)
        .end((error, res) => {
          expect(res.status).toEqual(401);
          expect(res.body).toHaveProperty('error');
          done();
        });
    });
  });
});
