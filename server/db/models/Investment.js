const Sequelize = require("sequelize");
const db = require("../db");


const Investment = db.define('investment', {
  tickerSymbol: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  buyPrice: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  totalShares: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
})


//hooks

Investment.beforeCreate(inv => {
  inv.tickerSymbol = inv.tickerSymbol.toUpperCase();
})

Investment.beforeUpdate(inv => {
  inv.tickerSymbol = inv.tickerSymbol.toUpperCase();
})


module.exports = Investment
