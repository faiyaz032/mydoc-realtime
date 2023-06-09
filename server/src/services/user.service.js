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

exports.getUserById = async userId => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new AppError(error.statusCode, error.message);
  }
};

exports.getUsers = async idToExclude => {
  try {
    const users = await User.find({ _id: { $ne: idToExclude } }).select({
      name: 1,
      email: 1,
    });
    return users;
  } catch (error) {
    console.log(error);
    throw new AppError(error.statusCode, error.message);
  }
};
