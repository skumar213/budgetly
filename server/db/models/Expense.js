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
    type: Sequelize.DECIMAL(10, 2),
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

//Hooks
//Makes the first letter of each word for the merchant name uppercase and the rest lowercase
Expense.beforeCreate(exp => {
  exp.merchant = exp.merchant
    .split(" ")
    .map(word => {
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
});

Expense.beforeUpdate(exp => {
  exp.merchant = exp.merchant
    .split(" ")
    .map(word => {
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
});

module.exports = Expense;
