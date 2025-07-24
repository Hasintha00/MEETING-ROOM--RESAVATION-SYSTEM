const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
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
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateRoom = async (req, res) => {
  const { name, capacity, description, location, amenities } = req.body;

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