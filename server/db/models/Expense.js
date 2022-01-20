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

//hooks

Expense.beforeCreate(exp => {
  const nameArr = exp.merchant.split(" ");
  const properCasing = nameArr.map(word => {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  });

  exp.merchant = properCasing.join(" ");
});

Expense.beforeUpdate(exp => {
  const nameArr = exp.merchant.split(" ");
  const properCasing = nameArr.map(word => {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  });

  exp.merchant = properCasing.join(" ");
});



module.exports = Expense;
