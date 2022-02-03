const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/expenses', require('./expenses'))
router.use("/categories", require("./categories"))
router.use('/budgets', require('./budgets'))
router.use('/investments', require('./investments'))
router.use('/yahoo', require('./yahoo'))
router.use('/monthlyIncome', require('./monthlyIncome'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
