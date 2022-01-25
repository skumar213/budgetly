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
import { sortSingle, sortDouble, months } from "../helpers";

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
      "category",
      "name"
    ) || [];

  useEffect(() => {
    dispatch(_getBudgets());
    dispatch(_getExpenses());
    dispatch(_getCategories());

    const currentDate = new Date();

    setCurrentMonth({
      name: months[currentDate.getMonth()],
      num: currentDate.getMonth() + 1,
    });
  }, []);

  //all states
  const [currentMonth, setCurrentMonth] = useState({});
  const [currentId, setCurrentId] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [amountRemaining, setamountRemaining] = useState("");
  const [isCreate, setIsCreate] = useState("");

  //legend to help call the setstate functions
  const legend = {
    currentId: setCurrentId,
    amount: setAmount,
    category: setCategory,
    amountRemaining: setamountRemaining,
  };

  //clear state helper
  const clearState = () => {
    for (let key in legend) {
      legend[key]("");
    }
  };

  //event handler for changing any form
  const handleChange = evt => {
    const fn = legend[evt.target.name];
    fn(evt.target.value);
  };

  //event handler for cancelling form edit
  const handleCancel = evt => {
    evt.preventDefault();

    clearState();
  };

  //event handlers for UPDATE
  const handleEdit = bud => evt => {
    evt.preventDefault();

    setCurrentId(Number(bud.id));
    setAmount(bud.amount);
    setCategory(bud.category.name);
  };

  const handleUpdateSubmit = evt => {
    evt.preventDefault();

    const budToUpdate = {
      id: currentId,
      amount,
      category,
    };

    dispatch(_updateBudget(budToUpdate));

    clearState();
  };

  //event handler for DELETE
  const handleDelete = bud => evt => {
    evt.preventDefault();

    dispatch(_deleteBudget(bud));
  };

  //Event handler for CREATE
  const handleCreateSubmit = evt => {
    evt.preventDefault();

    const newBud = {
      amount,
      category,
    };

    dispatch(_createBudget(newBud));

    clearState();
  };

  const handleCreate = evt => {
    evt.preventDefault();

    setIsCreate(true);
    setCategory(allCategories[0].name);
  };

  return <div>Budgets</div>;
};

export default Budgets;
