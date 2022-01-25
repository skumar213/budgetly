const router = require("express").Router();
const {
  models: { User, Budget, Category },
} = require("../db");
const { requireToken } = require("./gateKeepingMiddleware");
module.exports = router;


//GET /budget, gets all current budgets for user
router.get('/', requireToken, async (req, res, next) => {
  try {
    const userBudgets = await User.findOne({
      where: {
        id: req.user.id
      },
      include: {
        model: Budget,
        include: {
          model: Category
        }
      }
    })

    res.send(userBudgets)
  } catch (error) {
    next(error)
  }
})
