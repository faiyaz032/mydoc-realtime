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
  const { name, email, password } = req.body || {};

  if ((!name, !email, !password))
    return next(new AppError(400, 'name, email, password is required'));

  try {
    const userExists = await userService.getUserByEmail(email);
    if (userExists) {
      return next(new AppError(400, 'User already exists with this email'));
    }

    const user = await userService.createUser({ name, email, password });

    return res.status(201).json({
      status: 'success',
      message: 'User created successfully. ',
      accessToken: signToken({ _id: user._id, email: user.email }),
    });
  } catch (error) {
    console.log(error);
    next(new AppError(500, error.message));
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

exports.loginHandler = async (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || !password) return next(new AppError(400, 'email and password must be required'));

  try {
    const user = await userService.getUserByEmail(email);
    if (!user) return next(new AppError(401, 'Invalid email or password'));

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return next(new AppError(401, 'Invalid email or password'));
    }

    return res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      accessToken: signToken({ _id: user._id, email: user.email }),
    });
  } catch (error) {
    console.log(error);
    next(new AppError(500, error.message));
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.getUsersHandler = async (req, res, next) => {};
