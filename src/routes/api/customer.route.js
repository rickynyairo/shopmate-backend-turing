import { Router } from 'express';
import CustomerController from '../../controllers/customer.controller';
import {
  signupSchema,
  loginSchema,
  userProfileSchema,
  userAddressSchema,
  userCreditCardSchema,
} from '../../utils/validators/customer.validators';
import {
  BAD_SIGNUP_LOGIN_REQUEST,
  INVALID_PROFILE_UPDATE,
  INVALID_ADDRESS_UPDATE,
  INVALID_CREDIT_CARD_UPDATE,
} from '../../utils/constants';
import { requestValidation } from '../../middleware/validation';
import { jwtAuthRequired } from '../../middleware/authentication';
// These are valid routes but they may contain a bug, please try to define and fix them

const router = Router();
router.post('/customers', CustomerController.updateCreditCard);
router.post(
  '/customers/signup',
  requestValidation('user', signupSchema, BAD_SIGNUP_LOGIN_REQUEST),
  CustomerController.create
);
router.post(
  '/customers/login',
  requestValidation('user', loginSchema, BAD_SIGNUP_LOGIN_REQUEST),
  CustomerController.login
);
router.get('/customer', jwtAuthRequired, CustomerController.getCustomerProfile);
router.put(
  '/customer',
  requestValidation('user', userProfileSchema, INVALID_PROFILE_UPDATE),
  jwtAuthRequired,
  CustomerController.updateCustomerProfile
);
router.put(
  '/customer/address',
  requestValidation('user', userAddressSchema, INVALID_ADDRESS_UPDATE),
  jwtAuthRequired,
  CustomerController.updateCustomerAddress
);
router.put(
  '/customer/creditCard',
  requestValidation('credit_card', userCreditCardSchema, INVALID_CREDIT_CARD_UPDATE),
  jwtAuthRequired,
  CustomerController.updateCreditCard
);

export default router;
