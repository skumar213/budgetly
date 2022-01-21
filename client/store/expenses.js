import { authenticateRequest } from "./gateKeepingMiddleware";

//ACTION TYPES
const SET_EXPENSES = "SET_EXPENSES";
const UPDATE_EXPENSE = "UPDATE_EXPENSE";
const CREATE_EXPENSE = "CREATE_EXPENSE";
const DELETE_EXPENSE = "DELETE_EXPENSE";

//ACTION CREATORS
const setExpenses = expenses => ({ type: SET_EXPENSES, expenses });
const updateExpense = expense => ({ type: UPDATE_EXPENSE, expense });
const createExpense = expense => ({ type: CREATE_EXPENSE, expense });
const deleteExpense = expense => ({ type: DELETE_EXPENSE, expense });

//THUNK CREATORS
export const _setExpenses = expenses => {
  const expenses = await authenticateRequest("get", "/api/expenses");

  dispatch(setExpenses(expenses));
};

export const _updateExpenses = newExpInfo => async dispatch => {
  try {
    const updatedExpense = await authenticateRequest(
      "put",
      "/api/expenses",
      newExpInfo
    );

    dispatch(updateExpense(updatedExpense));
  } catch (error) {
    console.log(error);
  }
};

export const _createExpense = newExp => async dispatch => {
  try {
    const newExpense = await authenticateRequest(
      "post",
      "/api/expenses",
      newExp
    );

    dispatch(createExpense(newExpense));
  } catch (error) {
    console.log(error);
  }
};

export const _deleteExpense = exp => async dispatch => {
  try {
    const deleteConfirmation = await authenticateRequest(
      "delete",
      "/api/expense",
      exp
    );

    if (deleteConfirmation === 202) {
      dispatch(deleteExpense(exp));
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
    case SET_EXPENSES:
      return action.expenses;
    case UPDATE_EXPENSE:
      const updatedExpenses = state.filter(exp => exp.id !== action.expense.id);
      updatedExpenses.push(action.expense);
      return updatedExpenses;
    case CREATE_EXPENSE:
      const newExpenses = [...state, action.expense];
      return newExpenses;
    case DELETE_EXPENSE:
      const removedExpenses = state.filter(exp => exp.id !== action.expense.id);
      return removedExpenses;
    default:
      return state;
  }
}
