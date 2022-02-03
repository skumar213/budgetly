const db = require("./db");

const User = require("./models/User");
const Category = require("./models/Category");
const Expense = require("./models/Expense");
const Budget = require("./models/Budget");
const Investment = require("./models/Investment");
const MonthlyIncome = require('./models/MonthlyIncome')

//model associations
User.hasMany(Expense);
Expense.belongsTo(User);

Category.hasMany(Expense);
Expense.belongsTo(Category);

User.hasMany(Budget);
Budget.belongsTo(User);

Category.hasMany(Budget);
Budget.belongsTo(Category);

User.hasMany(Investment);
Investment.belongsTo(User);

User.hasMany(MonthlyIncome);
MonthlyIncome.belongsTo(User);



// console.log(Object.keys(Investment.prototype))

module.exports = {
  db,
  models: {
    User,
    Category,
    Expense,
    Budget,
    Investment,
    MonthlyIncome
  },
};
