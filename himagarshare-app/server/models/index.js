const { sequelize } = require('../config/database');

// Import model definitions
const UserModel = require('./User');
const ListingModel = require('./Listing');
const BookingModel = require('./Booking');

// Initialize models
const User = UserModel(sequelize);
const Listing = ListingModel(sequelize);
const Booking = BookingModel(sequelize);

// Define associations
// User - Listing (One-to-Many)
User.hasMany(Listing, {
  foreignKey: 'ownerId',
  as: 'listings',
  onDelete: 'CASCADE'
});
Listing.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner'
});

// User - Booking (One-to-Many as renter)
User.hasMany(Booking, {
  foreignKey: 'renterId',
  as: 'bookings',
  onDelete: 'CASCADE'
});
Booking.belongsTo(User, {
  foreignKey: 'renterId',
  as: 'renter'
});

// Listing - Booking (One-to-Many)
Listing.hasMany(Booking, {
  foreignKey: 'listingId',
  as: 'bookings',
  onDelete: 'CASCADE'
});
Booking.belongsTo(Listing, {
  foreignKey: 'listingId',
  as: 'listing'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Listing,
  Booking
};
