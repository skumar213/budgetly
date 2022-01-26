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

//PUT /investments, updates a single investment for a user
router.put('/', requireToken, async (req,res,next) => {
  try {
    const userInvestment = await Investment.findOne({
      where: {
        id: req.body.id
      },
      include: {
        model: User
      }
    })

    const updatedInvestment = await userInvestment.update(req.body)

    res.send(updatedInvestment).status(202)
  } catch (error) {
    next(error)
  }
})
