const router = require("express").Router();
const axios = require("axios").default;
module.exports = router;

//Yahoo finance api settings
const yahooOptions = tickerSymbol => {
  return {
    method: "GET",
    url: `https://yfapi.net/v6/finance/quote`,
    params: { symbols: `${tickerSymbol}` },
    headers: {
      "x-api-key": process.env.YAHOO_FINANCE_API,
    },
  };
};

//GET /yahoo/:tickerSymbol, will get a single or multiple stocks
//for multiple stocks separate with a comma
router.get("/:tickerSymbol", async (req, res, next) => {
  try {
    const symbolsArr = req.params.tickerSymbol.split(",");
    const params = yahooOptions(req.params.tickerSymbol);
    const { data } = await axios.request(params);
    const stock = data.quoteResponse.result;
    const wrongNameError = new Error("Invalid Ticker Symbol");

    //Throw error if any of the stock names are wrong
    if (stock.length !== symbolsArr.length) {
      next(wrongNameError);
    } else {
      const mappedStock = stock.map(s => {
        //Throws error if any of the required items are missing
        if (!s.symbol || !s.displayName || !s.regularMarketPrice) {
          throw wrongNameError;
        } else {
          return {
            symbol: s.symbol,
            name: s.displayName,
            currentPrice: s.regularMarketPrice,
          };
        }
      });

      res.send(mappedStock);
    }
  } catch (error) {
    next(error);
  }
});
