// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import { Attribute, AttributeValue } from '../../database/models';
import truncate from '../../test/helpers';

describe('attributes controller', () => {
  let attribute;
  let attributeValue;
  beforeAll(async done => {
    await truncate();
    attribute = await Attribute.create({
      name: 'Test Attribute',
    });
    attributeValue = await AttributeValue.create({
      attribute_id: attribute.attribute_id,
      value: 'Attribute description',
    });
    done();
  });

  afterAll(async done => {
    server.close();
    done();
  });

  describe('getAllAttributes', () => {
    it('should return a list of attributes', done => {
      request(app)
        .get('/attributes')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('length');
          expect(res.body.length).toBeGreaterThan(0);
          done();
        });
    });
  });

  describe('getAttributeAndValues', () => {
    it('should get the details of an attribute', done => {
      request(app)
        .get(`/attributes/${attribute.attribute_id}`)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('attribute_id');
          expect(res.body.attribute_id).toEqual(attribute.attribute_id);
          done();
        });
    });

    it('should return appropriate status if attribute is not found', done => {
      request(app)
        .get('/attributes/999999')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
    it('should get the attribute values associated with an attribute', done => {
      request(app)
        .get(`/attributes/values/${attribute.attribute_id}`)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body[0]).toHaveProperty('attribute_id');
          expect(res.body[0]).toHaveProperty('name');
          done();
        });
    });
  });
});
