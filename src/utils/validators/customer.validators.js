/* eslint-disable import/prefer-default-export */
import Joi from '@hapi/joi';

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
export const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegex)
    .message('Please enter a valid email address')
    .required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .message('Your password does not meet minimum requirements')
    .required(),
});

export const signupSchema = loginSchema.keys({
  name: Joi.string()
    .min(3)
    .pattern(/^[a-z ,.'-]+$/i)
    .message('Your name should only have letters with at least 3 characters')
    .required(),
});
