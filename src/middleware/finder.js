import { NOT_FOUND } from '../utils/constants';

/* eslint-disable import/prefer-default-export */
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
