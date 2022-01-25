import { authenticateRequest } from "./gateKeepingMiddleware";

//ACTION TYPES
const SET_CATEGORIES = "SET_CATEGORIES";

//ACTION CREATORS
const getCategories = categories => ({ type: SET_CATEGORIES, categories });

//THUNK CREATORS
export const _getCategories = () => async dispatch => {
  try {
    const categories = await authenticateRequest("get", "/api/categories");

    dispatch(getCategories(categories));
  } catch (error) {
    console.log(error);
  }
};

//REDUCER
export default function (state = [], action) {
  switch (action.type) {
    case SET_CATEGORIES:
      return action.categories;
    default:
      return state;
  }
}
