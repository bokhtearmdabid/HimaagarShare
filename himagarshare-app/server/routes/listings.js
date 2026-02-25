const express = require('express');
const router = express.Router();
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  getEarnings
} = require('../controllers/listingController');
const { authMiddleware, isHost } = require('../middleware/auth');

// Public routes
// @route   GET /api/listings
router.get('/', getListings);

// @route   GET /api/listings/:id
router.get('/:id', getListingById);

// Protected routes (Host only)
// @route   POST /api/listings
router.post('/', authMiddleware, isHost, createListing);

// @route   PUT /api/listings/:id
router.put('/:id', authMiddleware, isHost, updateListing);

// @route   DELETE /api/listings/:id
router.delete('/:id', authMiddleware, isHost, deleteListing);

// @route   GET /api/listings/my-listings
router.get('/host/my-listings', authMiddleware, isHost, getMyListings);

// @route   GET /api/listings/host/earnings
router.get('/host/earnings', authMiddleware, isHost, getEarnings);

module.exports = router;
