const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
    console.log(`Database Connected Successfully`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDatabase;
