
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

  // Create users with more realistic data
  const adminPassword = await bcrypt.hash('admin123', 10);
  const managerPassword = await bcrypt.hash('manager123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);

  const users = [
    { 
      name: 'Admin User', 
      email: 'admin@company.com', 
      password: adminPassword, 
      role: 'Admin' 
    },
    { 
      name: 'John Manager', 
      email: 'john.manager@company.com', 
      password: managerPassword, 
      role: 'Admin' 
    },
    { 
      name: 'Jane Staff', 
      email: 'jane.staff@company.com', 
      password: staffPassword, 
      role: 'Staff' 
    },
    { 
      name: 'Mike Developer', 
      email: 'mike.dev@company.com', 
      password: staffPassword, 
      role: 'Staff' 
    },
    { 
      name: 'Sarah Designer', 
      email: 'sarah.design@company.com', 
      password: staffPassword, 
      role: 'Staff' 
    },
  ];

  await User.insertMany(users);

  // Create rooms with enhanced data (2 meeting rooms + 1 auditorium)
  const rooms = [
    { 
      name: 'Meeting Room A', 
      capacity: 8,
      description: 'Small conference room perfect for team meetings',
      location: 'Floor 2, East Wing',
      amenities: ['Projector', 'Whiteboard', 'Video Conferencing', 'WiFi'],
      isActive: true
    },
    { 
      name: 'Meeting Room B', 
      capacity: 12,
      description: 'Medium-sized meeting room with modern equipment',
      location: 'Floor 2, West Wing',
      amenities: ['Smart TV', 'Whiteboard', 'Audio System', 'WiFi', 'Phone'],
      isActive: true
    },
    { 
      name: 'Main Auditorium', 
      capacity: 50,
      description: 'Large auditorium for presentations and company events',
      location: 'Ground Floor, Central',
      amenities: ['Stage', 'Microphone System', 'Projector', 'Sound System', 'Recording Equipment', 'WiFi'],
      isActive: true
    },
  ];

  await Room.insertMany(rooms);

  console.log('=== DATABASE SEEDED SUCCESSFULLY ===');
  console.log('\nDefault Login Credentials:');
  console.log('Admin: admin@company.com / admin123');
  console.log('Manager: john.manager@company.com / manager123');
  console.log('Staff: jane.staff@company.com / staff123');
  console.log('Staff: mike.dev@company.com / staff123');
  console.log('Staff: sarah.design@company.com / staff123');
  
  console.log('\nRooms Available:');
  rooms.forEach(room => {
    console.log(`- ${room.name} (Capacity: ${room.capacity}) - ${room.location}`);
  });
  
  mongoose.connection.close();
};

seed();
