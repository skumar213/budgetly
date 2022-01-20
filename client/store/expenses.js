import { authenticateRequest } from "./gateKeepingMiddleware";


//ACTION TYPES
const SET_EXPENSES = 'SET_EXPENSES'
const UPDATE_EXPENSE = 'UPDATE_EXPENSE'


//ACTION CREATORS
const setExpenses = (expenses) => ({type: SET_EXPENSES, expenses});
const updateExpense = (expense) => ({type: UPDATE_EXPENSE, expense})


//THUNK CREATORS
export const _setExpenses = (expenses) => {
  const expenses = await authenticateRequest('get', '/api/expenses');

  dispatch(setExpenses(expenses))
}

export const _updateExpenses = (newExpInfo) => async dispatch => {
  try {
    const updatedExpense = await authenticateRequest('put', '/api/expenses', newExpInfo);

    dispatch(updateExpense(updatedExpense))
  } catch (error) {
    console.log(error)
  }
}





//REDUCER
export default function(state=[], action) {
  switch (action.type) {
    case SET_EXPENSES:
      return action.expenses
    case UPDATE_EXPENSE:
      const updatedExpenses = state.filter(exp => exp.id !== action.expense.id);
      updatedExpenses.push(action.expense)

      return updatedExpenses
    default:
      return state
  }
}
