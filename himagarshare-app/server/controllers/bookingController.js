const { Booking, Listing, User } = require('../models');
const { Op } = require('sequelize');

// Helper function to calculate days between dates
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to check if dates overlap
const checkDateOverlap = (start1, end1, start2, end2) => {
  return start1 <= end2 && start2 <= end1;
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Renter only)
const createBooking = async (req, res) => {
  try {
    const { listingId, capacityRequired, startDate, endDate, notes } = req.body;

    // Validate required fields
    if (!listingId || !capacityRequired || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get listing
    const listing = await Listing.findOne({
      where: { id: listingId, status: 'active' }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found or not available'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Check capacity
    if (parseFloat(capacityRequired) > listing.availableCapacity) {
      return res.status(400).json({
        success: false,
        message: `Only ${listing.availableCapacity} cubic feet available`
      });
    }

    // Check for overlapping bookings with same capacity requirements
    const overlappingBookings = await Booking.findAll({
      where: {
        listingId,
        status: { [Op.in]: ['pending', 'approved'] },
        [Op.or]: [
          {
            startDate: { [Op.lte]: endDate },
            endDate: { [Op.gte]: startDate }
          }
        ]
      }
    });

    // Calculate total capacity booked during this period
    let totalBookedCapacity = 0;
    overlappingBookings.forEach(booking => {
      totalBookedCapacity += parseFloat(booking.capacityRequired);
    });

    const remainingCapacity = listing.totalCapacity - totalBookedCapacity;

    if (parseFloat(capacityRequired) > remainingCapacity) {
      return res.status(400).json({
        success: false,
        message: `Only ${remainingCapacity.toFixed(2)} cubic feet available for this period`
      });
    }

    // Calculate total price
    const days = calculateDays(startDate, endDate);
    const totalPrice = days * parseFloat(capacityRequired) * parseFloat(listing.pricePerDay);

    // Create booking
    const booking = await Booking.create({
      listingId,
      renterId: req.user.id,
      capacityRequired: parseFloat(capacityRequired),
      startDate,
      endDate,
      totalPrice: totalPrice.toFixed(2),
      notes,
      status: 'pending',
      paymentStatus: 'pending',
      paymentId: `MOCK_PAY_${Date.now()}` // Mock payment ID
    });

    // Get complete booking with relations
    const completeBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Listing,
          as: 'listing',
          include: [{ model: User, as: 'owner', attributes: ['name', 'email', 'phone'] }]
        },
        {
          model: User,
          as: 'renter',
          attributes: ['name', 'email', 'phone']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. Awaiting host approval.',
      booking: completeBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get renter's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Renter only)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { renterId: req.user.id },
      include: [
        {
          model: Listing,
          as: 'listing',
          include: [{ model: User, as: 'owner', attributes: ['name', 'businessName', 'phone'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get host's booking requests
// @route   GET /api/bookings/requests
// @access  Private (Host only)
const getBookingRequests = async (req, res) => {
  try {
    // Get all listings owned by the host
    const listings = await Listing.findAll({
      where: { ownerId: req.user.id },
      attributes: ['id']
    });

    const listingIds = listings.map(listing => listing.id);

    // Get all bookings for these listings
    const bookings = await Booking.findAll({
      where: {
        listingId: { [Op.in]: listingIds }
      },
      include: [
        {
          model: Listing,
          as: 'listing',
          attributes: ['id', 'title', 'location', 'type', 'pricePerDay']
        },
        {
          model: User,
          as: 'renter',
          attributes: ['name', 'businessName', 'email', 'phone']
        }
      ],
      order: [
        ['status', 'ASC'], // pending first
        ['createdAt', 'DESC']
      ]
    });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get booking requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update booking status (approve/reject)
// @route   PUT /api/bookings/:id/status
// @access  Private (Host only)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "approved" or "rejected"'
      });
    }

    // Get booking with listing
    const booking = await Booking.findOne({
      where: { id },
      include: [
        {
          model: Listing,
          as: 'listing',
          where: { ownerId: req.user.id }
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or you do not have permission to update it'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot update booking. Current status is ${booking.status}`
      });
    }

    // Update booking
    booking.status = status;
    if (status === 'rejected' && rejectionReason) {
      booking.rejectionReason = rejectionReason;
    }

    // If approved, update payment status (mock)
    if (status === 'approved') {
      booking.paymentStatus = 'paid';
      
      // Update listing available capacity
      const listing = await Listing.findByPk(booking.listingId);
      // Note: In a real app, you'd need more sophisticated capacity management
      // For now, we'll just mark it approved
    }

    await booking.save();

    // Get updated booking with relations
    const updatedBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Listing,
          as: 'listing'
        },
        {
          model: User,
          as: 'renter',
          attributes: ['name', 'email', 'phone']
        }
      ]
    });

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Renter only, own bookings)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      where: { id, renterId: req.user.id }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!['pending', 'approved'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this booking'
      });
    }

    booking.status = 'cancelled';
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded'; // Mock refund
    }
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingRequests,
  updateBookingStatus,
  cancelBooking
};
