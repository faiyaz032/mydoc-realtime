const express = require('express');
const userController = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.post('/', userController.createUserHandler);
userRouter.post('/login', userController.loginHandler);

module.exports = userRouter;
