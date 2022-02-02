import { months } from "../helpers";


//ACTION TYPES
const SET_DATE = 'SET_DATE'

//ACTION CREATORS
export const setDate = () => {
  const currentDate = new Date();

  return {
    type: SET_DATE,
    date: {
      name: months[currentDate.getMonth()][0],
      num: currentDate.getMonth() + 1,
      lastDay: months[currentDate.getMonth()][1]
    }
  }
}


//REDUCER
export default function (state = {}, action) {
  switch(action.type) {
    case SET_DATE:
      return action.date
    default:
      return state;
  }
}
