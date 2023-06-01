const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name must be required'] },
    email: { type: String, required: [true, 'Email must be required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const salt = await bcryptjs.genSalt(12);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return bcryptjs.compare(candidatePassword, this.password);
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
