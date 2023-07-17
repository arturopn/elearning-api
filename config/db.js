// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('railway', 'root', 'OOEYU9X4HlpI7dtKaniu', {
  host: 'containers-us-west-111.railway.app',
  dialect: 'mysql',
  port: '7776',
});

module.exports = { sequelize };
