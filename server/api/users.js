const router = require("express").Router();
const {
  models: { User },
} = require("../db");
const { requireToken } = require("./gateKeepingMiddleware");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ["id", "username"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

//PUT /users
router.put("/", requireToken, async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, monthlyIncome } = req.body;

    const updatedUser = await req.user.update({
      email,
      password,
      firstName,
      lastName,
      monthlyIncome,
    });

    res.send(updatedUser).status(202);
  } catch (error) {
    next(error);
  }
});
