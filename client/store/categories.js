import { authenticateRequest } from "./gateKeepingMiddleware";

//ACTION TYPES
const SET_CATEGORIES = "SET_CATEGORIES";

//ACTION CREATORS
const getCategories = categories => ({type: SET_CATEGORIES, categories});

//THUNK CREATORS
