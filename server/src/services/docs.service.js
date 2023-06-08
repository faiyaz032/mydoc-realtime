const Doc = require('../models/Doc');
const AppError = require('../utils/AppError');

exports.getDocsByUserId = async userId => {
  if (!userId) return new AppError('User Id must be required to get docs');
  try {
    const docs = await Doc.find({ createdBy: userId });
    return docs;
  } catch (error) {
    console.log(error);
  }
};

exports.findDocById = async id => {
  try {
    if (!id) return;
    const doc = await Doc.findOne({ _id: id });
    return doc;
  } catch (error) {
    console.log(error);
  }
};

exports.createDoc = async (docId, userId) => {
  try {
    if (!docId || !userId) {
      console.log(`Id must be required`);
      return;
    }
    return await Doc.create({ _id: docId, createdBy: userId });
  } catch (error) {
    console.log(error);
  }
};

exports.updateDoc = async (id, data) => {
  try {
    if (!id) {
      console.log(`Id must be required`);
      return;
    }
    return await Doc.findByIdAndUpdate(id, { data });
  } catch (error) {
    console.log(error);
  }
};

exports.addCollaborator = async (collaboratorId, docId) => {
  try {
    return await Doc.findByIdAndUpdate(
      docId,
      {
        $push: { collaborators: collaboratorId },
      },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};
