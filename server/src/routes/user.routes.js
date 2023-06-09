const express = require('express');
const userController = require('../controllers/user.controller');
const isAuth = require('../middlewares/isAuth');

const userRouter = express.Router();

userRouter.post('/', userController.createUserHandler);
userRouter.post('/login', userController.loginHandler);
userRouter.get('/', isAuth, userController.getUsersHandler);

module.exports = userRouter;
