const router = require("express").Router();
const {
  models: { User, Budget, Category },
} = require("../db");
const { requireToken } = require("./gateKeepingMiddleware");
module.exports = router;

//GET /budget, gets all current budgets for user
router.get("/", requireToken, async (req, res, next) => {
  try {
    const userBudgets = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: {
        model: Budget,
        include: {
          model: Category,
        },
      },
    });

    res.send(userBudgets);
  } catch (error) {
    next(error);
  }
});

//PUT /budgets, updates a single budget for a user
router.put("/", requireToken, async (req, res, next) => {
  try {
    const userBudget = await Budget.findOne({
      where: {
        id: req.body.id,
      },
      include: [
        {
          model: User,
          where: {
            id: req.user.id,
          },
        },
        {
          model: Category,
        },
      ],
    });

    if (req.body.category) {
      const expCatName = req.body.category;
      delete req.body.category;

      const category = await Category.findOne({
        where: {
          name: expCatName,
        },
      });

      await userBudget.setCategory(category);
    }

    await userBudget.update(req.body);

    const updatedBudget = await Budget.findOne({
      where: {
        id: req.body.id,
      },
      include: [
        {
          model: User,
          where: {
            id: req.user.id,
          },
        },
        {
          model: Category,
        },
      ],
    });

    res.send(updatedBudget).status(202);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireToken, async (req, res, next) => {
  try {
    const expCatName = req.body.category;
    delete req.body.category;

    const newBudget = await Budget.create(req.body);

    const category = await Category.findOne({
      where: {
        name: expCatName,
      },
    });

    const user = await User.findByPk(req.user.id);
    console.log(user);

    await user.addBudget(newBudget);

    await newBudget.setCategory(category);

    const budgetWithCategory = await Budget.findOne({
      where: {
        id: newBudget.id,
      },
      include: [
        {
          model: User,
          where: {
            id: req.user.id,
          },
        },
        {
          model: Category,
        },
      ],
    });

    res.send(budgetWithCategory).status(201);
  } catch (error) {
    next(error);
  }
});

router.delete("/:budId", requireToken, async (req, res, next) => {
  try {
    const budget = await Budget.findByPk(req.params.budId);

    await budget.destroy();

    res.sendStatus(202);
  } catch (error) {
    next(error);
  }
});
