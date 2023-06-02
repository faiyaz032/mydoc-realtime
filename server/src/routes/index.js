const express = require('express');
const docsRouter = require('./docs.routes');
const userRouter = require('./user.routes');
const isAuth = require('../middlewares/isAuth');

const apiRouter = express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/docs', isAuth, docsRouter);

module.exports = apiRouter;
