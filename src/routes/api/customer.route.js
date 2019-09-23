import { Router } from 'express';
import CustomerController from '../../controllers/customer.controller';
import { signupSchema, loginSchema } from '../../utils/validators/customer.validators';
import { BAD_SIGNUP_LOGIN_REQUEST } from '../../utils/constants';
import { validationMiddleware } from '../../middleware/validation';
// These are valid routes but they may contain a bug, please try to define and fix them

const router = Router();
router.post('/customers', CustomerController.updateCreditCard);
router.post(
  '/customers/signup',
  validationMiddleware('user', signupSchema, BAD_SIGNUP_LOGIN_REQUEST),
  CustomerController.create
);
router.post(
  '/customers/login',
  validationMiddleware('user', loginSchema, BAD_SIGNUP_LOGIN_REQUEST),
  CustomerController.login
);
router.get('/customer', CustomerController.getCustomerProfile);
router.put('/customer', CustomerController.apply);
router.put('/customer/address', CustomerController.updateCustomerAddress);
router.put('/customer/creditCard', CustomerController.updateCreditCard);

export default router;
