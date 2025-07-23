
const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  const { name, capacity } = req.body;

  try {
    const newRoom = new Room({
      name,
      capacity,
    });

    const room = await newRoom.save();
    res.json(room);
  } catch (err) {
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
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  const { name, capacity } = req.body;

  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    room.name = name || room.name;
    room.capacity = capacity || room.capacity;

    await room.save();
    res.json(room);
  } catch (err) {
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

    await room.remove();
    res.json({ msg: 'Room removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
