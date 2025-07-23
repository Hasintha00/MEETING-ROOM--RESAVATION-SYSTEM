
const Room = require('../models/Room');
const Booking = require('../models/Booking');

exports.createRoom = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  const { name, capacity, description, location, amenities } = req.body;

  try {
    const newRoom = new Room({
      name,
      capacity,
      description: description || '',
      location: location || '',
      amenities: amenities || [],
    });

    const room = await newRoom.save();
    res.json(room);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Room name already exists' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateRoom = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  const { name, capacity, description, location, amenities, isActive } = req.body;

  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    room.name = name || room.name;
    room.capacity = capacity || room.capacity;
    room.description = description !== undefined ? description : room.description;
    room.location = location !== undefined ? location : room.location;
    room.amenities = amenities !== undefined ? amenities : room.amenities;
    room.isActive = isActive !== undefined ? isActive : room.isActive;

    await room.save();
    res.json(room);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Room name already exists' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteRoom = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Room removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get available rooms for a specific time slot
exports.getAvailableRooms = async (req, res) => {
  try {
    const { startTime, endTime } = req.query;
    
    if (!startTime || !endTime) {
      return res.status(400).json({ msg: 'Start time and end time are required' });
    }

    // Get all rooms
    const allRooms = await Room.find();
    
    // Get booked rooms for the specified time slot
    const bookedRooms = await Booking.find({
      status: 'Active',
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
        { startTime: { $lte: new Date(startTime) }, endTime: { $gte: new Date(endTime) } },
      ],
    }).distinct('room');

    // Filter available rooms
    const availableRooms = allRooms.filter(room => 
      !bookedRooms.some(bookedRoomId => bookedRoomId.equals(room._id))
    );

    res.json(availableRooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
