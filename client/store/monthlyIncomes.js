import { authenticateRequest } from "./gateKeepingMiddleware";

//ACTION TYPES
const SET_MONTHLY_INCOMES = "SET_MONTHLY_INCOMES";
const UPDATE_MONTHLY_INCOME = "UPDATE_MONTHLY_INCOME";

//ACTION CREATORS
const getMonthlyIncomes = monthlyIncomes => ({
  type: SET_MONTHLY_INCOMES,
  monthlyIncomes,
});

const updateMonthlyIncome = monthlyIncome => ({
  type: UPDATE_MONTHLY_INCOME,
  monthlyIncome,
});

//THUNK CREATORS
export const _getMonthlyIncomes = () => async dispatch => {
  try {
    const userIncomes = await authenticateRequest("get", "/api/monthlyIncomes");

    dispatch(getMonthlyIncomes(userIncomes.monthlyIncomes));
  } catch (error) {
    console.log(error);
  }
};

export const _updateMonthlyIncome = newIncomeInfo => async dispatch => {
  try {
    const updatedIncome = await authenticateRequest(
      "put",
      `/api/monthlyIncomes`,
      newIncomeInfo
    );

    dispatch(updateMonthlyIncome(updatedIncome));
  } catch (error) {
    console.log(error);
  }
};

//REDUCER
export default function (state = [], action) {
  switch (action.type) {
    case SET_MONTHLY_INCOMES:
      return action.monthlyIncomes;
    case UPDATE_MONTHLY_INCOME:
      const updatedIncomes = state.filter(
        inc => inc.id !== action.monthlyIncomes.id
      );
      return [...updatedIncomes, action.monthlyIncomes];
    default:
      return state;
  }
}
