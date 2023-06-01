const express = require('express');
const docsRouter = require('./docs.routes');
const userRouter = require('./user.routes');

const apiRouter = express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/docs', docsRouter);

module.exports = apiRouter;
