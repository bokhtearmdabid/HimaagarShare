const { Listing, User, Booking } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all listings with filters
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const {
      location,
      type,
      tempMin,
      tempMax,
      minCapacity,
      maxCapacity,
      maxPrice,
      page = 1,
      limit = 12
    } = req.query;

    // Build filter conditions
    const where = { status: 'active' };

    if (location) {
      where.location = {
        [Op.iLike]: `%${location}%`
      };
    }

    if (type) {
      where.type = type;
    }

    if (tempMin !== undefined && tempMax !== undefined) {
      where.tempMin = { [Op.lte]: parseFloat(tempMax) };
      where.tempMax = { [Op.gte]: parseFloat(tempMin) };
    }

    if (minCapacity) {
      where.availableCapacity = { [Op.gte]: parseFloat(minCapacity) };
    }

    if (maxCapacity) {
      where.availableCapacity = { [Op.lte]: parseFloat(maxCapacity) };
    }

    if (maxPrice) {
      where.pricePerDay = { [Op.lte]: parseFloat(maxPrice) };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: listings } = await Listing.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'businessName', 'phone']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      listings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findOne({
      where: { id, status: 'active' },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'businessName', 'phone', 'email']
        }
      ]
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    res.json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('Get listing by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Host only)
const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      type,
      totalCapacity,
      tempMin,
      tempMax,
      pricePerDay,
      images,
      amenities
    } = req.body;

    // Validate required fields
    if (!title || !location || !type || !totalCapacity || !tempMin || !tempMax || !pricePerDay) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate temperature range
    if (parseFloat(tempMin) >= parseFloat(tempMax)) {
      return res.status(400).json({
        success: false,
        message: 'Minimum temperature must be less than maximum temperature'
      });
    }

    const listing = await Listing.create({
      ownerId: req.user.id,
      title,
      description,
      location,
      type,
      totalCapacity: parseFloat(totalCapacity),
      availableCapacity: parseFloat(totalCapacity),
      tempMin: parseFloat(tempMin),
      tempMax: parseFloat(tempMax),
      pricePerDay: parseFloat(pricePerDay),
      images: images || [],
      amenities: amenities || [],
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (Host only, own listings)
const updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findOne({
      where: { id, ownerId: req.user.id }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found or you do not have permission to edit it'
      });
    }

    const {
      title,
      description,
      location,
      type,
      totalCapacity,
      tempMin,
      tempMax,
      pricePerDay,
      images,
      amenities,
      status
    } = req.body;

    // Update fields
    if (title) listing.title = title;
    if (description !== undefined) listing.description = description;
    if (location) listing.location = location;
    if (type) listing.type = type;
    if (totalCapacity) {
      listing.totalCapacity = parseFloat(totalCapacity);
      // Adjust available capacity proportionally
      const usedCapacity = listing.totalCapacity - listing.availableCapacity;
      listing.availableCapacity = parseFloat(totalCapacity) - usedCapacity;
    }
    if (tempMin !== undefined) listing.tempMin = parseFloat(tempMin);
    if (tempMax !== undefined) listing.tempMax = parseFloat(tempMax);
    if (pricePerDay) listing.pricePerDay = parseFloat(pricePerDay);
    if (images) listing.images = images;
    if (amenities) listing.amenities = amenities;
    if (status) listing.status = status;

    await listing.save();

    res.json({
      success: true,
      message: 'Listing updated successfully',
      listing
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (Host only, own listings)
const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findOne({
      where: { id, ownerId: req.user.id }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found or you do not have permission to delete it'
      });
    }

    // Soft delete by setting status to 'deleted'
    listing.status = 'deleted';
    await listing.save();

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get host's own listings
// @route   GET /api/listings/my-listings
// @access  Private (Host only)
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: {
        ownerId: req.user.id,
        status: { [Op.ne]: 'deleted' }
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      listings
    });
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get host's earnings summary
// @route   GET /api/listings/earnings
// @access  Private (Host only)
const getEarnings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Booking,
          as: 'bookings',
          where: { status: 'approved' },
          required: false
        }
      ]
    });

    let totalEarnings = 0;
    let activeBookings = 0;
    let completedBookings = 0;

    listings.forEach(listing => {
      listing.bookings.forEach(booking => {
        totalEarnings += parseFloat(booking.totalPrice);
        if (booking.status === 'approved') activeBookings++;
        if (booking.status === 'completed') completedBookings++;
      });
    });

    res.json({
      success: true,
      earnings: {
        totalEarnings: totalEarnings.toFixed(2),
        activeBookings,
        completedBookings,
        totalListings: listings.length
      }
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  getEarnings
};
