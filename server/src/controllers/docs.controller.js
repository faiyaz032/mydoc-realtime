//dependencies
const express = require('express');
const docsService = require('../services/docs.service');
const AppError = require('../utils/AppError');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.getDocsHandler = async (req, res, next) => {
  if (!req.user) {
    return next(new AppError(401, 'You are not authorized'));
  }

  try {
    const docs = await docsService.getDocsByUserId(req.user._id);
    if (docs.length < 1) {
      next(new AppError(404, 'No docs found with for this user'));
    }
    return res.status(200).json({
      status: 'success',
      message: 'Docs fetched successfully',
      docs,
    });
  } catch (error) {
    console.log(error);
    next(new AppError(500, 'Error getting docs'));
  }
};
