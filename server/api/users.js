const router = require("express").Router();
const {
  models: { User },
} = require("../db");
const { requireToken } = require("./gateKeepingMiddleware");
module.exports = router;


//PUT /users
router.put("/", requireToken, async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const updatedUser = await req.user.update({
      email,
      password,
      firstName,
      lastName,
    });

    res.send(updatedUser).status(202);
  } catch (error) {
    next(error);
  }
});
