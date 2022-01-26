import { authenticateRequest } from "./gateKeepingMiddleware";

//ACTION TYPES
const SET_BUDGETS = "SET_BUDGETS";
const UPDATE_BUDGET = "UPDATE_BUDGET";
const CREATE_BUDGET = "CREATE_BUDGET";
const DELETE_BUDGET = "DELETE_BUDGET";

//ACTION CREATORS
const getBudgets = budgets => ({ type: SET_BUDGETS, budgets });
const updateBudget = budget => ({ type: UPDATE_BUDGET, budget });
const createBudget = budget => ({ type: CREATE_BUDGET, budget });
const deleteBudget = budget => ({ type: DELETE_BUDGET, budget });


//THUNK CREATORS
export const _getBudgets = () => async dispatch => {
  try {
    const userBudgets = await authenticateRequest("get", "/api/budgets");

    dispatch(getBudgets(userBudgets.budgets));
  } catch (error) {
    console.log(error);
  }
};

export const _updateBudget = newBudInfo => async dispatch => {
  try {
    const updatedBudget = await authenticateRequest(
      "put",
      "/api/budgets",
      newBudInfo
    );

    dispatch(updateBudget(updatedBudget));
  } catch (error) {
    console.log(error);
  }
};

export const _createBudget = newBud => async dispatch => {
  try {
    const newBudget = await authenticateRequest(
      "post",
      "/api/budgets",
      newBud
    );


    dispatch(createBudget(newBudget));
  } catch (error) {
    console.log(error);
  }
};

export const _deleteBudget = bud => async dispatch => {
  try {
    const deleteConfirmation = await authenticateRequest(
      "delete",
      `/api/budgets/${bud.id}`
    );

    if (deleteConfirmation.status === 202) {
      dispatch(deleteBudget(bud));
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
    case SET_BUDGETS:
      return action.budgets;
    case UPDATE_BUDGET:
      const updatedbudgets = state.filter(bud => bud.id !== action.budget.id);
      return [...updatedbudgets, action.budget];
    case CREATE_BUDGET:
      const newbudgets = [...state, action.budget];
      return newbudgets;
    case DELETE_BUDGET:
      const removedbudgets = state.filter(bud => bud.id !== action.budget.id);
      return removedbudgets;
    default:
      return state;
  }
}
