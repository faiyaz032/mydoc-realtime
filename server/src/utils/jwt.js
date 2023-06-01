const jwt = require('jsonwebtoken');

const signToken = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: '24h',
  });
};

module.exports = signToken;
