
const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.createBooking = async (req, res) => {
  const { room, startTime, endTime, title, description } = req.body;

  try {
    const existingBooking = await Booking.findOne({
      room,
      status: 'Active',
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({ msg: 'Room is already booked for this time slot' });
    }

    const newBooking = new Booking({
      user: req.user.id,
      room,
      startTime,
      endTime,
      title,
      description: description || '',
      status: 'Active',
    });

    const booking = await newBooking.save();
    await booking.populate('room');
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'Admin') {
      bookings = await Booking.find().populate('user', ['name']).populate('room');
    } else {
      bookings = await Booking.find({ user: req.user.id }).populate('room');
    }
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', ['name']).populate('room');
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateBooking = async (req, res) => {
  const { room, startTime, endTime, title, description } = req.body;

  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Check for conflicts only if time or room is being changed
    if (room !== booking.room.toString() || startTime !== booking.startTime || endTime !== booking.endTime) {
      const existingBooking = await Booking.findOne({
        room: room || booking.room,
        _id: { $ne: req.params.id },
        status: 'Active',
        $or: [
          { startTime: { $lt: endTime || booking.endTime, $gte: startTime || booking.startTime } },
          { endTime: { $gt: startTime || booking.startTime, $lte: endTime || booking.endTime } },
          { startTime: { $lte: startTime || booking.startTime }, endTime: { $gte: endTime || booking.endTime } },
        ],
      });

      if (existingBooking) {
        return res.status(400).json({ msg: 'Room is already booked for this time slot' });
      }
    }

    booking.room = room || booking.room;
    booking.startTime = startTime || booking.startTime;
    booking.endTime = endTime || booking.endTime;
    booking.title = title || booking.title;
    booking.description = description !== undefined ? description : booking.description;
    booking.updatedAt = new Date();

    await booking.save();
    await booking.populate('room');
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Booking removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get bookings by date range
exports.getBookingsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ msg: 'Start date and end date are required' });
    }

    let bookings;
    const query = {
      startTime: { $gte: new Date(startDate) },
      endTime: { $lte: new Date(endDate) }
    };

    if (req.user.role === 'Admin') {
      bookings = await Booking.find(query).populate('user', ['name']).populate('room');
    } else {
      bookings = await Booking.find({ ...query, user: req.user.id }).populate('room');
    }
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get bookings for a specific room
exports.getBookingsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    let bookings;
    if (req.user.role === 'Admin') {
      bookings = await Booking.find({ room: roomId }).populate('user', ['name']).populate('room');
    } else {
      bookings = await Booking.find({ room: roomId, user: req.user.id }).populate('room');
    }
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Cancel booking (soft delete with status)
exports.cancelBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    booking.status = 'Cancelled';
    await booking.save();
    
    res.json({ msg: 'Booking cancelled successfully', booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
