/* eslint-disable import/prefer-default-export */

import Joi from '@hapi/joi';

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export const stripeChargeSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegex)
    .message('Please enter a valid email address')
    .required(),
  order_id: Joi.number()
    .min(0)
    .message('The order_id provided is ivalid')
    .required(),
  stripeToken: Joi.string()
    .min(5)
    .message('The stripe token provided are invalid')
    .required(),
});
