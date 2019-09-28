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
export const PAGE_SIZE = 20;
export const INVALID_PROFILE_UPDATE = {
  error: {
    status: 401,
    code: 'USR_06',
    message: '',
    field: '',
  },
};
export const INVALID_ADDRESS_UPDATE = {
  error: {
    status: 401,
    code: 'USR_09',
    message: '',
    field: '',
  },
};
export const UNAUTHORISED_USER = {
  error: {
    status: 401,
    code: 'AUT_02',
    message:
      'You are not authorized to access this resourse. Please check authorization credentials.',
    field: 'authorization',
  },
};
export const NOTHING_TO_UPDATE = {
  info: {
    status: 200,
    message: 'No updates were made as there was nothing in the request body',
  },
};
export const INVALID_CREDIT_CARD_UPDATE = {
  error: {
    status: 401,
    code: 'USR_08',
    message: 'The credit card number provided is invalid',
    field: 'credit_card',
  },
};
export const INVALID_CART_ITEM = {
  error: {
    status: 400,
    code: 'USR_20',
    message: 'The item provided is invalid therefore cannot be added to the cart',
    field: 'shoppingCart/item',
  },
};
export const NOT_FOUND = {
  error: {
    code: 'USR_21',
    message: 'The requested resource was not found on the server',
  },
  status: 404,
};
export const INVALID_ORDER = {
  error: {
    status: 400,
    code: 'USR_22',
    message: 'The order sent has invalid items',
  },
};
export const INVALID_CHARGE = {
  error: {
    status: 400,
    code: 'USR_23',
    message: 'Charge could not be completed due to invalid request',
  },
};
export const INVALID_QUERY_PARAMETERS = {
  error: {
    status: 400,
    code: 'USR_24',
    message: 'Cannot execute query with provided parameters, please check',
  },
};
