const router = require("express").Router();
const sequelize = require('sequelize')
const Op = sequelize.Op
const {
  models: { User, MonthlyIncome },
} = require("../db");
const { requireToken } = require("./gateKeepingMiddleware");
module.exports = router;

//GET /monthlyIncome, gets all monthly incomes for a user
router.get('/', requireToken, async (req,res,next) => {
  try {
    const usersMonthlyIncomes = await User.findOne({
      where: {
        id: req.user.id
      },
      include: {
         model: MonthlyIncome
      }
    })

    res.send(usersMonthlyIncomes)

  } catch (error) {
    next(error)
  }
})


//PUT /monthlyIncome, updates a single monthly income for a user
router.put('/', requireToken, async (req, res, next) => {
  try {
    const userMonthlyIncome = await MonthlyIncome.findOne({
      where: {
        id: req.body.id
      },
      include: {
        model: User,
        where: {
          id: req.user.id
        }
      }
    })

    const updatedIncome = await userMonthlyIncome.update(req.body);

    res.send(updatedIncome)
  } catch (error) {
    next(error)
  }
})



//this should be for a put request
//GET /monthlyIncome/:date, gets a single monthly income for a specific time period
router.get('/:date', requireToken, async (req, res, next) => {
  try {
    const selectedDate = new Date(req.params.date)
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedYear = selectedDate.getFullYear();

    console.log("---------here", selectedMonth)

    const monthlyIncome = await MonthlyIncome.findOne({
      where: {
        createdAt : {
          [Op.gte]: `${selectedMonth}/1/${selectedYear}`
        }
      },
      include: {
        model: User
      }
    })


    res.send(monthlyIncome)
  } catch (error) {
    next(error)
  }
})
