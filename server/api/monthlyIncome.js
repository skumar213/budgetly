const router = require("express").Router();
const {
  models: { MonthlyIncome },
} = require("../db");
const { requireToken } = require("./gateKeepingMiddleware");
module.exports = router;


//GET /monthlyIncome
router.get('/:date', requireToken, async (req, res, next) => {
  try {


    
    const findOne({
      where: {
        created
      }
    })



  } catch (error) {
    next(error)
  }
})
