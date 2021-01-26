const router = require('express').Router();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_DB, process.env.DATABASE_USER, process.env.DATABASE_PW, {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql',
  logging: false
});

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
module.exports = router;