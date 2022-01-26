const router = require("express").Router();
const {
  models: { User },
} = require("../db");
const axios = require("axios").default;
module.exports = router;

//Yahoo finance api settings
const options = tickerSymbol => {
  return {
    method: "GET",
    url: `https://yfapi.net/v6/finance/quote`,
    params: { symbols: `${tickerSymbol}` },
    headers: {
      "x-api-key": process.env.YAHOO_FINANCE_API,
    },
  };
};

//GET /yahoo/singleStock, will get the single stock that the user wants to add to their portfolio
router.get("/stock/:tickerSymbol", async (req, res, next) => {
  try {
    const symbolsArr = req.params.tickerSymbol.split(',')
    const params = options(req.params.tickerSymbol);
    const { data } = await axios.request(params);
    const stock = data.quoteResponse.result;

    if (stock.length !== symbolsArr.length) {
      throw new Error("Invalid stock name");
    } else {
      res.send(stock);
    }
  } catch (error) {
    next(error);
  }
});
