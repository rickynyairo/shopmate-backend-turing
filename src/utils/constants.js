/* eslint-disable import/prefer-default-export */
// collects various contants such as error messages used in the application

export const BAD_SIGNUP_LOGIN_REQUEST = {
  error: {
    status: 400,
    code: 'USR_02',
    message: '',
    field: '',
  },
};
export const USER_ALREADY_EXISTS = {
  error: {
    status: 400,
    code: 'USR_04',
    message: 'The email provided is already in use by another user',
    field: 'email',
  },
};
export const UNAUTHORISED_LOGIN = {
  error: {
    status: 400,
    code: 'USR_01',
    message: 'The email and password combination provided is invalid',
    field: 'email & password',
  },
};
export const PAGE_SIZE = 50;
export const UNAUTHORISED_USER = {
  error: {
    status: 401,
    code: 'AUT_02',
    message:
      'You are not authorized to access this resourse. Please check authorization credentials.',
    field: 'authorization',
  },
};
