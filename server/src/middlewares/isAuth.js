const express = require('express');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const isAuth = (req, res, next) => {
  const authHeader = `${req.get('Authorization')}`;

  const [, token] = authHeader.split(' ');

  if (!token) return next(new AppError(400, 'Please provide a valid JWT token'));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) throw new AppError(401, 'Authentication Failed');

  req.user = decoded;

  return next();
};

module.exports = isAuth;
