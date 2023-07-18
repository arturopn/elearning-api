// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('railway', 'root', 'GmhTruR3egve5lbmVd97', {
  host: 'containers-us-west-85.railway.app',
  dialect: 'mysql',
  port: '6968',
});

module.exports = { sequelize };
