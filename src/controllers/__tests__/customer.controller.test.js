// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import truncate from '../../test/helpers';

describe('Customer Controller', () => {
  let customer;
  let accessToken;
  beforeAll(async done => {
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
    // create a second user
    await request(app)
      .post('/customers/signup')
      .set('Content-Type', 'application/json')
      .send({ ...customer, email: 'test_customer2@email.com' });
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
    it('should update the profile of an authenticated user', done => {
      const newUserDetails = {
        email: 'new_email@email.com',
        name: 'new name',
        day_phone: '254714393946',
        eve_phone: '254714393947',
        mob_phone: '254714393948',
      };
      request(app)
        .put('/customer')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newUserDetails)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('customer_id');
          expect(res.body.name).toEqual(newUserDetails.name);
          done();
        });
    });
    it('should not update the profile with an email that exists in the db', done => {
      const newUserDetails = {
        email: 'test_customer2@email.com',
      };
      request(app)
        .put('/customer')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newUserDetails)
        .end((error, res) => {
          expect(res.status).toEqual(400);
          expect(res.body).toHaveProperty('error');
          done();
        });
    });
  });
  describe('Address', () => {
    it('should update the address of an authenticated user', done => {
      const newUserDetails = {
        address_1: '123 - Test Ave.',
        address_2: '789 - Pass Str.',
        city: 'nairobi',
        region: 'allsops',
        postal_code: '00100',
        shipping_region_id: 7,
      };
      request(app)
        .put('/customer/address')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newUserDetails)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('customer_id');
          expect(res.body.address_1).toEqual(newUserDetails.address_1);
          expect(res.body.address_2).toEqual(newUserDetails.address_2);
          done();
        });
    });
    it('should not update the address of an unauthenticated user', done => {
      const newUserDetails = {
        address_1: '123 - Test Ave.',
        address_2: '789 - Pass Str.',
        city: 'nairobi',
        region: 'allsops',
      };
      request(app)
        .put('/customer/address')
        .set('Authorization', `Bearer faketoken`)
        .send(newUserDetails)
        .end((error, res) => {
          expect(res.status).toEqual(401);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          done();
        });
    });
    it('should only update the address with valid data', done => {
      const newUserDetails = {
        address_1: '123 - Test Ave.',
        address_2: '789 - Pass Str.',
        shipping_region_id: 'should be an integer',
      };
      request(app)
        .put('/customer/address')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newUserDetails)
        .end((error, res) => {
          expect(res.status).toEqual(400);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          done();
        });
    });
    it('should not update with an empty request object', done => {
      request(app)
        .put('/customer/address')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('info');
          expect(res.body.info).toHaveProperty('message');
          done();
        });
    });
  });
  describe('Credit Card', () => {
    it('should update the credit card details of an authenticated user', done => {
      const creditCardDetails = {
        credit_card: '4012888888881881',
      };
      request(app)
        .put('/customer/creditCard')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(creditCardDetails)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('customer_id');
          expect(res.body.credit_card).toEqual(creditCardDetails.credit_card);
          done();
        });
    });
    it('should not update the credit card of an unauthenticated user', done => {
      const creditCardDetails = {
        credit_card: '1234567890',
      };
      request(app)
        .put('/customer/creditCard')
        .set('Authorization', `Bearer faketoken`)
        .send(creditCardDetails)
        .end((error, res) => {
          expect(res.status).toEqual(401);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          done();
        });
    });
    it('should only update the credit card details with valid data', done => {
      const creditCardDetails = {
        credit_card: '1234567898765432123456677',
      };
      request(app)
        .put('/customer/creditCard')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(creditCardDetails)
        .end((error, res) => {
          expect(res.status).toEqual(400);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.code).toEqual('USR_08');
          done();
        });
    });
  });
});
