
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getBookings);
router.get('/:id', auth, bookingController.getBookingById);
router.put('/:id', auth, bookingController.updateBooking);
router.delete('/:id', auth, bookingController.deleteBooking);

module.exports = router;
