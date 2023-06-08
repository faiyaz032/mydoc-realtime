//dependencies
const AppError = require('../utils/AppError');
const express = require('express');
const userService = require('../services/user.service');
const signToken = require('../utils/jwt');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.createUserHandler = async (req, res, next) => {
  try {
    // Extract the name, email, and password from the request body
    const { name, email, password } = req.body || {};

    // Check if name, email, and password are provided
    if (!name || !email || !password) {
      return next(new AppError(400, 'Name, email, and password are required'));
    }

    // Check if a user already exists with the provided email
    const userExists = await userService.getUserByEmail(email);
    if (userExists) {
      return next(new AppError(400, 'User already exists with this email'));
    }

    // Create a new user with the provided name, email, and password
    const user = await userService.createUser({ name, email, password });

    // Generate an access token for the user
    const accessToken = signToken({ _id: user._id, email: user.email });

    // Return a success response with the access token
    return res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      accessToken,
    });
  } catch (error) {
    // Log the error
    console.log(error);

    // Forward the error to the error handling middleware
    next(new AppError(500, error.message));
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

exports.loginHandler = async (req, res, next) => {
  try {
    // Extract the email and password from the request body
    const { email, password } = req.body || {};

    // Check if both email and password are provided
    if (!email || !password) {
      return next(new AppError(400, 'Email and password must be required'));
    }

    // Retrieve the user based on the email
    const user = await userService.getUserByEmail(email);

    // Check if a user with the provided email exists
    if (!user) {
      return next(new AppError(401, 'Invalid email or password'));
    }

    // Compare the provided password with the stored password
    const isValidPassword = await user.comparePassword(password);

    // Check if the provided password is valid
    if (!isValidPassword) {
      return next(new AppError(401, 'Invalid email or password'));
    }

    // Generate an access token for the user
    const accessToken = signToken({ _id: user._id, email: user.email });

    // Return a success response with the access token
    return res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      accessToken,
    });
  } catch (error) {
    // Log the error
    console.log(error);

    // Forward the error to the error handling middleware
    next(new AppError(500, error.message));
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.getUsersHandler = async (req, res, next) => {};
