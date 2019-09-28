/* eslint-disable import/prefer-default-export */
import { NOT_FOUND } from '../utils/constants';
/**
 * finds item using the primary key
 *
 * @param {string} item the name of the object being obtained from the db
 * @param {object} model the Sequelize model representing the object
 * @returns {function} finder middleware function
 */
export const getObjectOr404 = (item, model) => {
  return async (req, res, next) => {
    const pk = req.params[`${item}_id`];
    const found = await model.findByPk(pk);
    if (!found) {
      return res.status(404).send(NOT_FOUND);
    }
    req[item] = found;
    return next();
  };
};
