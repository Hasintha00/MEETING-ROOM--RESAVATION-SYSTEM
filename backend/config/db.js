
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Please check:');
    console.error('1. Your IP address is whitelisted in MongoDB Atlas');
    console.error('2. Your MongoDB credentials are correct');
    console.error('3. Your network connection is stable');
    process.exit(1);
  }
};

module.exports = connectDB;
