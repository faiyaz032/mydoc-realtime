const Doc = require('../models/Doc');

module.exports.findDocById = async id => {
  try {
    if (!id) return;
    const doc = await Doc.findOne({ _id: id });
    return doc;
  } catch (error) {
    console.log(error);
  }
};

module.exports.createDoc = async id => {
  try {
    if (!id) {
      console.log(`Id must be required`);
      return;
    }
    return await Doc.create({ _id: id });
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateDoc = async (id, data) => {
  try {
    if (!id) {
      console.log(`Id must be required`);
      return;
    }
    return await Doc.findByIdAndUpdate(id, { data });
  } catch (error) {}
};
