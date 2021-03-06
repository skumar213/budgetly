const router = require("express").Router();
const {
  models: { Category },
} = require("../db");
const { requireToken, isAdmin } = require("./gateKeepingMiddleware");
module.exports = router;

router.get("/", requireToken, async (req, res, next) => {
  try {
    const allCategories = await Category.findAll();

    res.send(allCategories);
  } catch (error) {
    next(error);
  }
});
