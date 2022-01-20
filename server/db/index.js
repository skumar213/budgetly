const db = require('./db')

const User = require('./models/User')
const Category = require('./models/Category')
const Expense = require('./models/Expense')

//model associations

User.hasMany(Expense)
Expense.belongsTo(User)

Category.hasMany(Expense)
Expense.belongsTo(Category)


module.exports = {
  db,
  models: {
    User,
    Category,
    Expense
  },
}
