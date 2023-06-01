const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.createUser = async user => {
  try {
    return User.create(user);
  } catch (error) {
    console.log(error);
    throw new AppError(500, 'Error creating user');
  }
};

exports.getUserByEmail = async email => {
  try {
    return User.findOne({ email: email });
  } catch (error) {
    console.log(error);
    throw new AppError(500, 'Error creating user');
  }
};
