const { Sequelize } = require('sequelize');
require('dotenv').config();

const logging = process.env.DB_LOGGING === 'true' ? console.log : false;

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging,
    dialectOptions: process.env.DB_SSL === 'true'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : undefined
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'petbnb',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      dialect: 'postgres',
      logging
    }
  );
}

module.exports = { sequelize };
