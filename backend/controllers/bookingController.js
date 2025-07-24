const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  const { room, user, startTime, endTime, title, description } = req.body;

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
      user,
      room,
      startTime,
      endTime,
      title,
      description: description || '',
      status: 'Active',
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
    const bookings = await Booking.find().populate('user', ['name']).populate('room');
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

    booking.room = room || booking.room;
    booking.startTime = startTime || booking.startTime;
    booking.endTime = endTime || booking.endTime;
    booking.title = title || booking.title;
    booking.description = description !== undefined ? description : booking.description;

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Booking removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};