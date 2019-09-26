/* eslint-disable import/prefer-default-export */

import Joi from '@hapi/joi';

export const cartItemSchema = Joi.object({
  cart_id: Joi.string()
    .length(32)
    .message('The cart_id should be a string of 32 characters'),
  product_id: Joi.number()
    .min(0)
    .message('The product_id provided is ivalid'),
  attributes: Joi.string()
    .min(2)
    .message('The attributes provided are invalid'),
  quantity: Joi.number()
    .min(1)
    .message('The quantity provided is invalid'),
});

export const orderSchema = Joi.object({
  cart_id: Joi.string()
    .length(32)
    .message('The cart_id should be a string of 32 characters')
    .required(),
  shipping_id: Joi.number()
    .min(0)
    .message('The shipping_id provided is ivalid')
    .required(),
  tax_id: Joi.number()
    .min(1)
    .message('The tax_id provided is invalid')
    .required(),
  comments: Joi.string()
    .max(255)
    .message('The comment is too long'),
});
