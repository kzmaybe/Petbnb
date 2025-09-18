const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const User = require('./User');
const Listing = require('./Listing');

const Booking = sequelize.define('Booking', {
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  status: { type: DataTypes.ENUM('pending','approved','rejected'), defaultValue: 'pending' }
});

Booking.belongsTo(User, { foreignKey: 'ownerId' });
User.hasMany(Booking, { foreignKey: 'ownerId' });

Booking.belongsTo(Listing, { foreignKey: 'listingId' });
Listing.hasMany(Booking, { foreignKey: 'listingId' });

module.exports = Booking;
