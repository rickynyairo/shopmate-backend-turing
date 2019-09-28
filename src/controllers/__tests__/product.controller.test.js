// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import { Product, Department, Category } from '../../database/models';
import truncate from '../../test/helpers';

describe('product controller', () => {
  let product;
  let department;
  let category;
  beforeAll(async done => {
    await truncate();
    product = await Product.create({
      name: 'New T shirt',
      description: 'Simple T shirt',
      price: 14.99,
    });
    department = await Department.create({
      name: 'Groceries',
      description: 'Daily groceries',
    });
    category = await Category.create({
      name: 'Category',
      department_id: department.department_id,
      description: 'A good category',
    });
    done();
  });

  afterAll(async done => {
    server.close();
    done();
  });

  describe('getAllProducts', () => {
    it('should return a list of products', done => {
      request(app)
        .get('/products?page=3&search=the&limit=30')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('rows');
          expect(res.body).toHaveProperty('pagination');
          expect(res.body.pagination.page).toEqual(3);
          done();
        });
    });
  });

  describe('getProduct', () => {
    it('should get the details of a product', done => {
      request(app)
        .get(`/products/${product.product_id}`)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('product_id');
          done();
        });
    });

    it('should return appropriate status if product is not found', done => {
      request(app)
        .get('/products/999999')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
  });

  describe('getAllDepartments', () => {
    it('should return a list of departments', done => {
      request(app)
        .get('/departments')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual('object');
          done();
        });
    });
  });

  describe('getDepartment', () => {
    it('should get the details of a department', done => {
      request(app)
        .get(`/departments/${department.department_id}`)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('department_id');
          done();
        });
    });

    it('should return appropriate status if department is not found', done => {
      request(app)
        .get('/departments/999999')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
  });
  describe('getAllCategories', () => {
    it('should return a list of categories', done => {
      request(app)
        .get('/categories')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual('object');
          done();
        });
    });
  });

  describe('getCategory', () => {
    it('should get the details of a category', done => {
      request(app)
        .get(`/categories/${category.category_id}`)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('department_id');
          expect(res.body).toHaveProperty('category_id');
          expect(res.body.department_id).toEqual(department.department_id);
          done();
        });
    });
    it('should get the categories by department', done => {
      request(app)
        .get(`/categories/inDepartment/${department.department_id}`)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body[0]).toHaveProperty('department_id');
          expect(res.body[0]).toHaveProperty('category_id');
          expect(res.body[0].department_id).toEqual(department.department_id);
          done();
        });
    });

    it('should return appropriate status if category is not found', done => {
      request(app)
        .get('/categories/999999')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
  });
});
