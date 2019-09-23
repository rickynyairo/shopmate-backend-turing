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

export const userProfileSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegex)
    .message('Please enter a valid email address'),
  eve_phone: Joi.string()
    .min(7)
    .message('The phone number provided is invalid'),
  day_phone: Joi.string()
    .min(7)
    .message('The phone number provided is invalid'),
  mob_phone: Joi.string()
    .min(7)
    .message('The phone number provided is invalid'),
  name: Joi.string()
    .min(3)
    .pattern(/^[a-z ,.'-]+$/i)
    .message('Your name should only have letters with at least 3 characters'),
});

export const userAddressSchema = Joi.object({
  address_1: Joi.string()
    .min(5)
    .message('The address provided is ivalid'),
  address_2: Joi.string()
    .min(5)
    .message('The address provided is ivalid'),
  city: Joi.string()
    .min(2)
    .message('The city provided is invalid'),
  region: Joi.string()
    .min(2)
    .message('The phone number provided is invalid'),
  postal_code: Joi.string()
    .min(3)
    .message('The postal code provided is invalid'),
  shipping_region_id: Joi.number()
    .min(1)
    .message('The shipping region id should be a number'),
});

export const userCreditCardSchema = Joi.object({
  credit_card: Joi.string()
    .pattern(/^[0-9]{10,20}$/)
    .message('The credit card number provided is invalid')
    .required(),
});
