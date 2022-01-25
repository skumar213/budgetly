import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import history from "../history";
import {
  _getBudgets,
  _updateBudget,
  _createBudget,
  _deleteBudget,
} from "../store/budgets";
import { _getCategories } from "../store/categories";
import { _getExpenses } from "../store/expenses";
import { sortSingle, sortDouble } from "../helpers";

const Budgets = () => {
  const dispatch = useDispatch();
  const allCategories =
    sortSingle(
      useSelector(state => state.categories),
      "name"
    ) || [];

  const allExpenses =
    sortSingle(
      useSelector(state => state.expenses),
      "merchant"
    ) || [];

  const allBudgets =
    sortDouble(
      useSelector(state => state.budgets),
      "category", "name"
    ) || [];

  useEffect(() => {
    dispatch(_getBudgets());
    dispatch(_getExpenses());
    dispatch(_getCategories());
  }, []);

  console.log(allBudgets);

  return <div>Budgets</div>;
};

export default Budgets;
