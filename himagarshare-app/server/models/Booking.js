const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    listingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'listings',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    renterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    capacityRequired: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 1
      },
      comment: 'Required capacity in cubic feet'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isAfterStartDate(value) {
          if (value <= this.startDate) {
            throw new Error('End date must be after start date');
          }
        }
      }
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      },
      comment: 'Total booking price'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional notes from renter'
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for rejection if applicable'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded'),
      defaultValue: 'pending',
      comment: 'Mock payment status'
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Mock payment transaction ID'
    }
  }, {
    tableName: 'bookings',
    timestamps: true,
    indexes: [
      {
        fields: ['listingId']
      },
      {
        fields: ['renterId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['startDate', 'endDate']
      }
    ]
  });

  return Booking;
};
