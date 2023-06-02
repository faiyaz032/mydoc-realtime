const mongoose = require('mongoose');

const docSchema = new mongoose.Schema(
  {
    _id: { type: String, required: [true, '_id must be required'] },
    data: { type: Object, default: {} },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'User Id must be required'],
    },
    collaborators: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Doc = mongoose.model('Doc', docSchema);

module.exports = Doc;
