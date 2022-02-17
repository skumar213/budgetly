import { authenticateRequest } from "./gateKeepingMiddleware";
import axios from "axios";
import { setError } from "./errorHandler";
import { sortSingle } from "../helpers";

//ACTION TYPES
const SET_INVESTMENTS = "SET_INVESTMENTS";
const UPDATE_INVESTMENT = "UPDATE_INVESTMENT";
const CREATE_INVESTMENT = "CREATE_INVESTMENT";
const DELETE_INVESTMENT = "DELETE_INVESTMENT";

//ACTION CREATORS
const getInvestments = investments => ({ type: SET_INVESTMENTS, investments });
const updateInvestment = investment => ({
  type: UPDATE_INVESTMENT,
  investment,
});
const createInvestment = investment => ({
  type: CREATE_INVESTMENT,
  investment,
});
const deleteInvestment = investment => ({
  type: DELETE_INVESTMENT,
  investment,
});

//THUNK CREATORS
export const _getInvestments = () => async dispatch => {
  try {
    const userInvestments = await authenticateRequest(
      "get",
      "/api/investments"
    );

    dispatch(getInvestments(userInvestments.investments));
  } catch (error) {
    console.log(error);
  }
};

export const getInvestmentsPrice = investments => async dispatch => {
  try {
    const tickerSymbols = investments.reduce((accu, inv, idx) => {
      if (idx === 0) {
        return accu + inv.tickerSymbol;
      } else {
        return accu + "," + inv.tickerSymbol;
      }
    }, "");

    const { data: currentInvestmentPrices } = await axios.get(
      `/api/yahoo/${tickerSymbols}`
    );

    const currentInvestmentPricesSorted = sortSingle(
      currentInvestmentPrices,
      "symbol"
    );

    //updates db with currentPrice
    investments.forEach((inv, idx) => {
      dispatch(
        _updateInvestment({
          id: inv.id,
          tickerSymbol: inv.tickerSymbol,
          buyPrice: inv.buyPrice,
          currentPrice: currentInvestmentPricesSorted[idx].currentPrice,
        })
      );
    });
  } catch (error) {
    console.log(error);
  }
};

export const _updateInvestment = newInvInfo => async dispatch => {
  try {
    const stockSymbol = newInvInfo.tickerSymbol.toUpperCase();

    //Need this to catch error if stock is invalid
    const actualStockSymbol = await axios.get(`/api/yahoo/${stockSymbol}`);

    const updatedInvestment = await authenticateRequest(
      "put",
      "/api/investments",
      newInvInfo
    );
    dispatch(updateInvestment(updatedInvestment));
  } catch (error) {
    console.log(error);
    return dispatch(setError({ error: error.response.data }));
  }
};

export const _createInvestment = newInv => async dispatch => {
  try {
    const stockSymbol = newInv.tickerSymbol.toUpperCase();

    //Need this to catch error if stock is invalid
    const {data: actualStockData} = await axios.get(`/api/yahoo/${stockSymbol}`);

    newInv.currentPrice = actualStockData[0].currentPrice

    const newInvestment = await authenticateRequest(
      "post",
      "/api/investments",
      newInv
    );

    dispatch(createInvestment(newInvestment));
  } catch (error) {
    console.log(error);
    return dispatch(setError({ error: error.response.data }));
  }
};

export const _deleteInvestment = inv => async dispatch => {
  try {
    const deleteConfirmation = await authenticateRequest(
      "delete",
      `/api/investments/${inv.id}`
    );

    if (deleteConfirmation.status === 202) {
      dispatch(deleteInvestment(inv));
    } else {
      throw new Error("Item not deleted");
    }
  } catch (error) {
    console.log(error);
  }
};

//REDUCER
export default function (state = [], action) {
  switch (action.type) {
    case SET_INVESTMENTS:
      return action.investments;
    case UPDATE_INVESTMENT:
      const updatedInvestments = state.filter(
        inv => inv.id !== action.investment.id
      );
      return [...updatedInvestments, action.investment];
    case CREATE_INVESTMENT:
      return [...state, action.investment];
    case DELETE_INVESTMENT:
      const removedInvestments = state.filter(
        inv => inv.id !== action.investment.id
      );
      return removedInvestments;
    default:
      return state;
  }
}
