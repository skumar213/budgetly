import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import auth from "./auth";
import expenses from "./expenses";
import categories from "./categories";
import budgets from "./budgets";
import investments from "./investments";
import errorHandler from "./errorHandler";
import date from "./date";
import monthlyIncomes from "./monthlyIncomes";

const reducer = combineReducers({
  auth,
  expenses,
  categories,
  budgets,
  investments,
  errorHandler,
  date,
  monthlyIncomes,
});

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);

const store = createStore(reducer, middleware);

export default store;
export * from "./auth";
