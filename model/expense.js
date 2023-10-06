const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const expense = sequelize.define('expenses',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  expense: Sequelize.INTEGER,
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false
  }
});


module.exports = expense;