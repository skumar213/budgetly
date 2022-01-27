//ACTION TYPES
const SET_ERROR = "SET_ERROR";
const CLEAR_ERROR = "CLEAR_ERROR";

//ACTION CREATORS
export const setError = error => ({ type: SET_ERROR, error });
export const clearError = () => ({ type: CLEAR_ERROR, error: {} });

//REDUCER
export default function (state = {}, action) {
  switch (action.type) {
    case SET_ERROR:
      return action.error;
    case CLEAR_ERROR:
      return action.error;
    default:
      return state;
  }
}
