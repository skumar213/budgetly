const router = require("express").Router();
const {
  models: { User, Expense, Category },
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
        id: req.body.id,
      },
      include: {
        model: User,
        where: {
          id: req.user.id,
        },
      },
    });

    if (req.body.category) {
      const expCatName = req.body.category;
      delete req.body.category;

      const category = await Category.findOne({
        where: {
          name: expCatName,
        },
      });

      await userExpense.setCategory(category);
    }

    const updatedExpense = await userExpense.update(req.body);

    res.send(updatedExpense).status(202);
  } catch (error) {
    next(error);
  }
});

//PUT /expenses, creates a single expense for a user
router.post("/", requireToken, async (req, res, next) => {
  try {
    const expCatName = req.body.category;
    delete req.body.category;

    const newExpense = await Expense.create(req.body);
    const category = await Category.findOne({
      where: {
        name: expCatName,
      },
    });
    await newExpense.setCategory(category);

    const user = await User.findByPk(req.user.id);
    await user.addExpense(newExpense);

    res.send(newExpense).status(201);
  } catch (error) {
    next(error);
  }
});

//DELETE /expenses, deletes expense for user
router.delete("/", requireToken, async (req, res, next) => {
  try {
    const expense = await Expense.findByPk(req.body.id);

    await expense.destroy();

    res.sendStatus(202);
  } catch (error) {
    next(error);
  }
});
