const db = require('./db')

const User = require('./models/User')
const Category = require('./models/Category')
const Expense = require('./models/Expense')

//associations could go here!

module.exports = {
  db,
  models: {
    User,
    Category
  },
}
