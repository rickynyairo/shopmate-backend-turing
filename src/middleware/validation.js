/* eslint-disable import/prefer-default-export */
export const validationMiddleware = (item, schema, errorObject) => {
  return (req, res, next) => {
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
