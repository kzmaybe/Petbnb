const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const User = require('./User');

const Listing = sequelize.define('Listing', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.FLOAT,
  location: DataTypes.STRING
});

Listing.belongsTo(User, { foreignKey: 'sitterId' });
User.hasMany(Listing, { foreignKey: 'sitterId' });

module.exports = Listing;
