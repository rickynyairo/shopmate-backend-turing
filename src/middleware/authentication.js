/* eslint-disable import/prefer-default-export */
import jwt from 'jsonwebtoken';
import { Customer } from '../database/models';
import { UNAUTHORISED_USER } from '../utils/constants';

export const jwtAuthRequired = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json(UNAUTHORISED_USER);
  }
  // Bearer Token
  const token = authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.customer = await Customer.findByPk(decoded.customer_id, { exclude: ['password'] });
    return next();
  } catch (err) {
    return res.status(401).json(UNAUTHORISED_USER);
  }
};
