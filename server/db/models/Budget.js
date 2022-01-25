const Sequelize = require("sequelize");
const db = require("../db");

const Budget = db.define('budget', {
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  month: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 1,
      max: 12
    },
  }
})

module.exports = Budget;
