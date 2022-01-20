const router = require("express").Router();
const {
  models: { User, Expense },
} = require("../db");
const { requireToken } = require("./gateKeepingMiddleware");
module.exports = router;


//GET /expenses, gets all current expenses for user
