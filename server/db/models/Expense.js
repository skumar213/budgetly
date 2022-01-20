const Sequelize = require("sequelize");
const db = require("../db");

const Expense = db.define("expense", {
  merchant: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  amount: {
    type: Sequelize.DECIMAL(10,2),
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
      isDate: true,
    },
  },
  paidDate: {
    type: Sequelize.DATEONLY,
    validate: {
      isDate: true,
    },
  },
  isRepeat: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Expense;
