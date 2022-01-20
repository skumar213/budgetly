const router = require("express").Router();
const {
  models: { User, Expense },
} = require("../db");
const { requireToken } = require("./gateKeepingMiddleware");
module.exports = router;

//GET /expenses, gets all current expenses for user
router.get("/", requireToken, async (req, res, next) => {
  try {
    const userExpenses = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: {
        model: Expense,
      },
    });

    res.send(userExpenses);
  } catch (error) {
    next(error);
  }
});


//PUT /expenses, updates a single expense for a user
router.put("/", requireToken, async (req, res, next) => {
  try {
    const userExpense = await Expense.findOne({
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

    const updatedExpense = await userExpense.update(req.body)

    res.send(updatedExpense);
  } catch (error) {
    next(error);
  }
});
