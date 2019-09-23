/* eslint-disable import/prefer-default-export */
// collects various contants such as error messages used in the application

export const BAD_SIGNUP_LOGIN_REQUEST = {
  error: {
    status: 400,
    code: 'USR_04',
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
    code: 'USR_04',
    message: 'The email and password combination provided is invalid',
    field: 'email & password',
  },
};
