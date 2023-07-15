// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('elearning', 'admin', '1q2w3e4r', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = { sequelize };
