const router = require("express").Router();
const {
  models: { User, Investment },
} = require("../db");
const { requireToken } = require("./gateKeepingMiddleware");
module.exports = router;


//GET /investments, gets all investments for user
router.get('/', requireToken, async (req, res, next) => {
  try {
    const userInvestments = await User.findOne({
      where: {
        id: req.user.id
      },
      include: {
        model: Investment
      }
    })

    res.send(userInvestments)
  } catch (error) {
    next(error)
  }
})
