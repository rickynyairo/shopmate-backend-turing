/* eslint-disable import/prefer-default-export */
export const getObjectOr404 = model => {
  return async (req, res, next) => {
    const modelName = model.name.toLowerCase();
    const pk = req.params[`${modelName}_id`];
    const item = await model.findByPk(pk);
    if (!item) {
      return res.status(404).send({ error: '404 not found' });
    }
    req[modelName] = item;
    return next();
  };
};
