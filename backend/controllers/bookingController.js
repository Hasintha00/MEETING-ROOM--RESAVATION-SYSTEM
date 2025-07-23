
const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.createBooking = async (req, res) => {
  const { room, startTime, endTime, title } = req.body;

  try {
    const existingBooking = await Booking.findOne({
      room,
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
    });

    const booking = await newBooking.save();
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
  const { room, startTime, endTime, title } = req.body;

  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const existingBooking = await Booking.findOne({
      room,
      _id: { $ne: req.params.id },
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({ msg: 'Room is already booked for this time slot' });
    }

    booking.room = room || booking.room;
    booking.startTime = startTime || booking.startTime;
    booking.endTime = endTime || booking.endTime;
    booking.title = title || booking.title;

    await booking.save();
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

    await booking.remove();
    res.json({ msg: 'Booking removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
