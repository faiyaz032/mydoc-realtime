const express = require('express');
const docsController = require('../controllers/docs.controller');

const docsRouter = express.Router();

docsRouter.get('/', docsController.getDocsHandler);

module.exports = docsRouter;
