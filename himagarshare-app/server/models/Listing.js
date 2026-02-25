const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Listing = sequelize.define('Listing', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM('Freezer', 'Chiller', 'Dry Cold Room'),
      allowNull: false
    },
    totalCapacity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 1
      },
      comment: 'Total capacity in cubic feet'
    },
    availableCapacity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      },
      comment: 'Currently available capacity in cubic feet'
    },
    tempMin: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Minimum temperature in Celsius'
    },
    tempMax: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Maximum temperature in Celsius'
    },
    pricePerDay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      },
      comment: 'Price per cubic foot per day'
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Array of image URLs'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'deleted'),
      defaultValue: 'active'
    },
    amenities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'e.g., 24/7 access, security, backup power'
    }
  }, {
    tableName: 'listings',
    timestamps: true,
    indexes: [
      {
        fields: ['ownerId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['type']
      }
    ]
  });

  return Listing;
};
