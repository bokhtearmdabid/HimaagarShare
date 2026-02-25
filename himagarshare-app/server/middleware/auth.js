const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

// Middleware to check if user is a host
const isHost = (req, res, next) => {
  if (req.user.role !== 'host') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Host role required.'
    });
  }
  next();
};

// Middleware to check if user is a renter
const isRenter = (req, res, next) => {
  if (req.user.role !== 'renter') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Renter role required.'
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  isHost,
  isRenter
};
