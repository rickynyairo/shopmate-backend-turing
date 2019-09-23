/* eslint-disable import/prefer-default-export */
import { NOTHING_TO_UPDATE } from '../utils/constants';

export const validationMiddleware = (item, schema, errorObject) => {
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
