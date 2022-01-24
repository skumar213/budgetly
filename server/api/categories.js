const router = require("express").Router();
const {
  models: { User, Expense, Category },
} = require("../db");
const { requireToken, isAdmin } = require("./gateKeepingMiddleware");
module.exports = router;

router.get("/", requireToken, isAdmin, async (req, res, next) => {
  try {
    const allCategories = await Category.findAll();

    res.send(allCategories);
  } catch (error) {
    next(error);
  }
});
