const db = require('./db')

const User = require('./models/User')
const Category = require('./models/Category')
const Expense = require('./models/Expense')
const Budget = require('./models/Budget')

//model associations
User.hasMany(Expense)
Expense.belongsTo(User)

Category.hasMany(Expense)
Expense.belongsTo(Category)

User.hasMany(Budget)
Budget.belongsTo(User)

Category.hasMany(Budget)
Budget.belongsTo(Category)

// console.log(Object.keys(Expense.prototype))


module.exports = {
  db,
  models: {
    User,
    Category,
    Expense,
    Budget
  },
}
