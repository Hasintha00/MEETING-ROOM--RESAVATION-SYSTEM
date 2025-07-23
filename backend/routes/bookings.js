
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getBookings);
router.get('/date-range', auth, bookingController.getBookingsByDateRange);
router.get('/room/:roomId', auth, bookingController.getBookingsByRoom);
router.get('/:id', auth, bookingController.getBookingById);
router.put('/:id', auth, bookingController.updateBooking);
router.patch('/:id/cancel', auth, bookingController.cancelBooking);
router.delete('/:id', auth, bookingController.deleteBooking);

module.exports = router;
