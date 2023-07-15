const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Theme = require('./Theme');

const Content = sequelize.define('Content', {
  type: {
    type: DataTypes.ENUM('image', 'video', 'text'),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  credits: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: true,
    },
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Content.belongsTo(User, { foreignKey: 'userId' });
Content.belongsTo(Theme, { foreignKey: 'themeId' });

module.exports = Content;
