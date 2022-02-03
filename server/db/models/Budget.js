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
})

module.exports = Budget;
