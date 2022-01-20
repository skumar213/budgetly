const Sequelize = require('sequelize')
const db = require('../db')

const Expense = db.define('expense', {
  merchant: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  dueDate: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  paidDate: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  isRepeat: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },


})

module.exports = Expense
