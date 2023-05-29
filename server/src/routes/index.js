const express = require('express');
const docsRouter = require('./docs.routes');

const apiRouter = express.Router();

apiRouter.use('/docs', docsRouter);

module.exports = apiRouter;
