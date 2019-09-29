/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import { NOTHING_TO_UPDATE, PAGE_SIZE, INVALID_QUERY_PARAMETERS } from '../utils/constants';
import { querySchema } from '../utils/validators/product.validator';

/**
 * request object validator
 *
 * @static
 * @param {string} item the name of the object being verified
 * @param {object} schema the Joi schema that will be used to verify
 * @param {object} errorObject the error object to be returned incase of an error
 * @returns {function} validation middleware function
 */
export const requestValidation = (item, schema, errorObject) => {
  return (req, res, next) => {
    if (Object.keys(req.body).length < 1) {
      // the request body does not have any item
      // nothing to update
      return res.status(200).json(NOTHING_TO_UPDATE);
    }
    const { error, value } = schema.validate(req.body);
    if (error) {
      const {
        message,
        context: { label },
      } = error.details[0];
      const errorResponse = {
        ...errorObject.error,
        message,
        field: label,
      };
      return res.status(400).send({ error: errorResponse });
    }
    // no errors
    // save item to request scope
    req[item] = value;
    return next();
  };
};
/**
 * query object validator
 *
 * @param {object} schema the Joi schema that will be used to verify
 * @param {object} errorObject the error object to be returned incase of an error
 * @returns {function} validation middleware function
 */
export const queryValidation = (schema = querySchema, errorObject = INVALID_QUERY_PARAMETERS) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);
    if (error) {
      const {
        message,
        context: { label },
      } = error.details[0];
      const errorResponse = {
        ...errorObject.error,
        message,
        field: label,
      };
      return res.status(400).send({ error: errorResponse });
    }
    // no errors
    const { page, order, description_length } = value;
    let { limit } = value;
    const sortingOrder = order in ['asc', 'desc'] ? order : 'asc';
    // limit refers to page size
    if (!limit) {
      limit = PAGE_SIZE;
    }
    const offset = page && page > 0 ? limit * (page - 1) : 0;
    // save query items to request scope
    req.query_params = {
      ...value,
      limit,
      order: sortingOrder,
      description_length: description_length || 200,
      offset,
    };
    return next();
  };
};
