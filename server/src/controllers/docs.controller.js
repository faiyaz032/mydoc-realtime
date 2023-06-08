//dependencies
const express = require('express');
const docsService = require('../services/docs.service');
const userService = require('../services/user.service');
const AppError = require('../utils/AppError');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.getDocsHandler = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return next(new AppError(401, 'You are not authorized'));
    }

    // Retrieve the documents associated with the user
    const docs = await docsService.getDocsByUserId(req.user._id);

    // Check if any documents are found
    if (docs.length < 1) {
      next(new AppError(404, 'No documents found for this user'));
    }

    // Return a success response with the retrieved documents
    return res.status(200).json({
      status: 'success',
      message: 'Documents fetched successfully',
      docs,
    });
  } catch (error) {
    // Log the error
    console.log(error);

    // Forward the error to the error handling middleware
    next(new AppError(error.statusCode, error.message));
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.addCollaboratorHandler = async (req, res, next) => {
  try {
    // Extract the document ID and collaborator ID from the request body
    const { docId, collaboratorId } = req.body;

    // Check if both docId and collaboratorId are provided
    if (!docId || !collaboratorId) {
      return next(new AppError(400, 'docId and collaboratorId must be required'));
    }

    // Retrieve the collaborator based on the collaboratorId
    const collaborator = await userService.getUserById(collaboratorId);

    // Check if the collaborator exists
    if (!collaborator) {
      return next(new AppError(404, 'No collaborator found with the given ID'));
    }

    // Find the document based on the docId
    const doc = await docsService.findDocById(docId);

    // Check if the user making the request is the creator of the document
    if (doc.createdBy.toHexString() !== req.user._id) {
      return next(new AppError(400, 'Only the creator of this document can add collaborators'));
    }

    if (doc.collaborators.includes(collaboratorId)) {
      return next(new AppError(400, 'Collaborator already exists in this document'));
    }

    // Add the collaborator to the collaborators array of the document in database
    doc.collaborators.push(collaboratorId);

    // Save the updated document
    await doc.save();

    // Return a success response
    return res.status(200).json({
      status: 'success',
      message: 'Collaborator added successfully',
    });
  } catch (error) {
    // Log the error
    console.log(error);

    // Forward the error to the error handling middleware
    next(new AppError(500, 'Error adding collaborator'));
  }
};
