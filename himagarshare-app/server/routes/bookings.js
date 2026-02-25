const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingRequests,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { authMiddleware, isRenter, isHost } = require('../middleware/auth');

// Renter routes
// @route   POST /api/bookings
router.post('/', authMiddleware, isRenter, createBooking);

// @route   GET /api/bookings/my-bookings
router.get('/my-bookings', authMiddleware, isRenter, getMyBookings);

// @route   PUT /api/bookings/:id/cancel
router.put('/:id/cancel', authMiddleware, isRenter, cancelBooking);

// Host routes
// @route   GET /api/bookings/requests
router.get('/requests', authMiddleware, isHost, getBookingRequests);

// @route   PUT /api/bookings/:id/status
router.put('/:id/status', authMiddleware, isHost, updateBookingStatus);

module.exports = router;
