const Sequelize = require("sequelize");
const db = require("../db");

const MonthlyIncome = db.define("monthlyIncome", {
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
})

module.exports = MonthlyIncome
