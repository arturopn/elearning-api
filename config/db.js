// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('railway', 'root', 'no60RNEghy2QbfkvMO9a', {
  host: 'containers-us-west-95.railway.app',
  dialect: 'mysql',
  port: '7550',
});

module.exports = { sequelize };
