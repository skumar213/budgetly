const router = require("express").Router();
const sequelize = require("sequelize");
const Op = sequelize.Op;
const {
  models: { User, MonthlyIncome },
} = require("../db");
const { requireToken } = require("./gateKeepingMiddleware");
module.exports = router;

//GET /monthlyIncomes, gets all monthly incomes for a user
router.get("/", requireToken, async (req, res, next) => {
  try {
    const usersMonthlyIncomes = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: {
        model: MonthlyIncome,
      },
    });

    res.send(usersMonthlyIncomes);
  } catch (error) {
    next(error);
  }
});

//PUT /monthlyIncomes, updates a single monthly income for a user
router.put("/", requireToken, async (req, res, next) => {
  try {
    const userMonthlyIncome = await MonthlyIncome.findOne({
      where: {
        id: req.body.id,
      },
      include: {
        model: User,
        where: {
          id: req.user.id,
        },
      },
    });

    const updatedIncome = await userMonthlyIncome.update(req.body);

    res.send(updatedIncome);
  } catch (error) {
    next(error);
  }
});

//POST, /monthlyIncomes, creates a single monthly income for a user
router.post("/", requireToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const newMonthlyIncome = await MonthlyIncome.create(req.body);
    const userWithMonthlyIncome = await newMonthlyIncome.setUser(user);

    res.send(userWithMonthlyIncome).status(201);
  } catch (error) {
    next(error);
  }
});
