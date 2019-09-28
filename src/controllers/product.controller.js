/* eslint-disable camelcase */
/**
 * The Product controller contains all static methods that handles product request
 * Some methods work fine, some needs to be implemented from scratch while others may contain one or two bugs
 * The static methods and their function include:
 *
 * - getAllProducts - Return a paginated list of products
 * - searchProducts - Returns a list of product that matches the search query string
 * - getProductsByCategory - Returns all products in a product category
 * - getProductsByDepartment - Returns a list of products in a particular department
 * - getProduct - Returns a single product with a matched id in the request params
 * - getAllDepartments - Returns a list of all product departments
 * - getDepartment - Returns a single department
 * - getAllCategories - Returns all categories
 * - getSingleCategory - Returns a single category
 * - getDepartmentCategories - Returns all categories in a department
 *
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
import {
  Product,
  Department,
  AttributeValue,
  Attribute,
  Category,
  Sequelize,
} from '../database/models';
import { NOT_FOUND } from '../utils/constants';

const { Op, literal } = Sequelize;
const productAttributes = [
  'product_id',
  'name',
  'price',
  'discounted_price',
  'image',
  'image_2',
  'thumbnail',
  'display',
  'description',
];
/**
 *
 *
 * @class ProductController
 */
class ProductController {
  /**
   * get all products
   * @static
   * @async
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getAllProducts(req, res, next) {
    const { description_length, offset, limit, search, page } = req.query_params;
    const description = literal(
      `SUBSTRING(description, 1, ${description_length || 200}) AS description`
    );
    const sqlQueryMap = {
      limit,
      offset,
      attributes: [...productAttributes, description],
    };
    if (search) {
      // add search terms to query
      sqlQueryMap.where = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      };
    }
    try {
      const { rows, count } = await Product.findAndCountAll(sqlQueryMap);
      return res.status(200).send({
        pagination: {
          page,
          offset,
          pageSize: limit,
        },
        count,
        rows,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get all products by caetgory
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getProductsByCategory(req, res, next) {
    try {
      const { category_id } = req.params; // eslint-disable-line
      const { page, limit, offset } = req.query_params;
      const { rows, count } = await Product.findAndCountAll({
        include: [
          {
            model: Category,
            where: {
              category_id,
            },
            attributes: ['name', 'description'],
          },
        ],
        limit,
        offset,
      });
      return res.status(200).send({
        pagination: {
          page,
          offset,
          pageSize: limit,
        },
        count,
        rows,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get all products by department
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getProductsByDepartment(req, res, next) {
    try {
      const { department_id } = req.params; // eslint-disable-line
      const { page, limit, offset } = req.query_params;
      const { rows, count } = await Product.findAndCountAll({
        include: [
          {
            model: Category,
            include: [
              {
                model: Department,
                where: {
                  department_id,
                },
                attributes: ['name', 'description'],
              },
            ],
          },
        ],
        limit,
        offset,
      });
      return res.status(200).send({
        pagination: {
          page,
          offset,
          pageSize: limit,
        },
        count,
        rows,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get single product details
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product details
   * @memberof ProductController
   */
  static async getProduct(req, res, next) {
    const { description_length } = req.query;
    const { product_id } = req.params; // eslint-disable-line
    try {
      const product = await Product.findByPk(product_id, {
        include: [
          {
            model: AttributeValue,
            as: 'attributes',
            attributes: ['value'],
            through: {
              attributes: [],
            },
            include: [
              {
                model: Attribute,
                as: 'attribute_type',
              },
            ],
          },
        ],
        attributes: [
          Sequelize.literal(
            `SUBSTRING(description, 1, ${description_length || 200}) as description`
          ),
          ...productAttributes,
        ],
      });
      if (!product) {
        return res.status(404).json({ error: 'not found' });
      }
      return res.status(200).json(product);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get all departments
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and department list
   * @memberof ProductController
   */
  static async getAllDepartments(req, res, next) {
    try {
      const departments = await Department.findAll();
      return res.status(200).json(departments);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get a single department
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getDepartment(req, res, next) {
    const { department_id } = req.params; // eslint-disable-line
    try {
      const department = await Department.findByPk(department_id);
      if (!department) throw NOT_FOUND;
      return res.status(200).json(department);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method should get all categories
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getAllCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      return res.status(200).json(categories);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method should get a single category using the categoryId
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getSingleCategory(req, res, next) {
    try {
      const { category_id } = req.params;
      const category = await Category.findByPk(category_id);
      if (!category) throw NOT_FOUND;
      return res.status(200).json(category);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method should get list of categories in a department
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getDepartmentCategories(req, res, next) {
    const { department_id } = req.params; // eslint-disable-line
    try {
      const categories = await Category.findAll({
        include: [
          {
            model: Department,
            where: {
              department_id,
            },
            attributes: ['name', 'description'],
          },
        ],
      });
      return res.status(200).send(categories);
    } catch (error) {
      return next(error);
    }
  }
}

export default ProductController;
