/* eslint-disable import/prefer-default-export */
import Joi from '@hapi/joi';

export const querySchema = Joi.object({
  page: Joi.number()
    .min(1)
    .message('The page number should be an integer minimum 1'),
  description_length: Joi.number()
    .min(1)
    .message('The description length provided is ivalid'),
  limit: Joi.number()
    .min(1)
    .message('The limit provided is invalid'),
  order: Joi.string()
    .max(4)
    .message("The order should be 'asc' or 'desc'"),
  search: Joi.string(),
});
