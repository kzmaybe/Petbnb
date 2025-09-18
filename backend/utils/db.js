const { Sequelize } = require('sequelize'); // Import Sequelize ORM
require('dotenv').config();                  // Load environment variables

// Initialize Sequelize connection to PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Database name
  process.env.DB_USER,     // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host (localhost or remote)
    port: process.env.DB_PORT, // <-- Add this line
    dialect: 'postgres',       // Database type
    logging: console.log,      // Optional: logs SQL queries
  }
);

module.exports = { sequelize }; // Export connection to use in models
