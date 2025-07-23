
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Simple connection without SSL options that might cause issues
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Please check:');
    console.error('1. Your IP address is whitelisted in MongoDB Atlas');
    console.error('2. Your MongoDB credentials are correct');
    console.error('3. Your network connection is stable');
    console.error('4. Try using a VPN if you have connection issues');
    
    // Try alternative connection for development
    console.error('\nTrying alternative connection...');
    try {
      const localUri = 'mongodb://localhost:27017/meeting-room-system';
      await mongoose.connect(localUri);
      console.log('Connected to local MongoDB successfully');
    } catch (localErr) {
      console.error('Local MongoDB also failed. Please ensure MongoDB Atlas is properly configured.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
