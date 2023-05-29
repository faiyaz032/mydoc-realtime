const mongoose = require('mongoose');

const docSchema = new mongoose.SchemaType(
  {
    _id: { type: mongoose.Types.ObjectId, required: [true, '_id must be required'] },
    data: { type: Object, default: {} },
    //collaborators: [{}], will implement collaborator after user authentication
  },
  {
    timestamps: true,
  }
);

const Doc = mongoose.model('Doc', docSchema);

module.exports = Doc;
