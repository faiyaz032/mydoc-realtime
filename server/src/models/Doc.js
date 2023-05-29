const mongoose = require('mongoose');

const docSchema = new mongoose.Schema(
  {
    _id: { type: String, required: [true, '_id must be required'] },
    data: { type: Object, default: {} },
    //collaborators: [{}], will implement collaborator after user authentication
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Doc = mongoose.model('Doc', docSchema);

module.exports = Doc;
