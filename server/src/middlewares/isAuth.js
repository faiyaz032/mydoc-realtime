const express = require('express');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const isAuth = (req, res, next) => {
  // Extract the authorization header from the request
  const authHeader = `${req.get('Authorization')}`;

  // Split the authorization header to extract the token
  const [, token] = authHeader.split(' ');

  // Check if a token is provided
  if (!token) {
    return next(new AppError(400, 'Please provide a valid JWT token'));
  }

  try {
    // Verify and decode the JWT token using the JWT_SECRET_KEY
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Check if the token is valid and contains decoded information
    if (!decoded) {
      throw new AppError(401, 'Authentication Failed');
    }

    // Set the decoded user information in the request object
    req.user = decoded;

    // Move to the next middleware
    return next();
  } catch (error) {
    // Forward any error to the error handling middleware
    throw new AppError(401, 'Authentication Failed');
  }
};

module.exports = isAuth;
