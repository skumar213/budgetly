import { authenticateRequest } from "./gateKeepingMiddleware";

//ACTION TYPES
const SET_MONTHLY_INCOMES = "SET_MONTHLY_INCOMES";

//ACTION CREATORS
const getMonthlyIncomes = monthlyIncomes => ({ type: SET_MONTHLY_INCOMES, monthlyIncomes });

//THUNK CREATORS
export const _getMonthlyIncomes = () => async dispatch => {
  try {
    const userIncomes = await authenticateRequest("get", "/api/monthlyIncomes");

    dispatch(getMonthlyIncomes(userIncomes.monthlyIncomes));
  } catch (error) {
    console.log(error);
  }
};

//REDUCER
export default function (state = [], action) {
  switch (action.type) {
    case SET_MONTHLY_INCOMES:
      return action.monthlyIncomes;
    default:
      return state;
  }
}
