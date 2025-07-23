
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Room = require('./models/Room');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Room.deleteMany({});

  // Create users
  const adminPassword = await bcrypt.hash('password123', 10);
  const staffPassword = await bcrypt.hash('password123', 10);

  const users = [
    { name: 'Admin User', email: 'admin@example.com', password: adminPassword, role: 'Admin' },
    { name: 'Staff User', email: 'staff@example.com', password: staffPassword, role: 'Staff' },
  ];

  await User.insertMany(users);

  // Create rooms
  const rooms = [
    { name: 'Meeting Room 1', capacity: 10 },
    { name: 'Meeting Room 2', capacity: 15 },
    { name: 'Auditorium', capacity: 100 },
  ];

  await Room.insertMany(rooms);

  console.log('Database seeded');
  mongoose.connection.close();
};

seed();
