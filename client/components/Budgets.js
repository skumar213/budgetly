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

  const currentMonthlyIncome = useSelector(state => state.auth.monthlyIncome)
  const currentTotalBudgetAmount = allBudgets.reduce((accu, bud) => accu + parseFloat(bud.amount), 0)
  const currentRemainingBudget = (currentMonthlyIncome - currentTotalBudgetAmount).toFixed(2);


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
    isCreate: setIsCreate,
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
      month: currentMonth.num
    };

    dispatch(_createBudget(newBud));

    clearState();
  };

  const handleCreate = evt => {
    evt.preventDefault();

    setIsCreate(true);
    setCategory(allCategories[0].name);
  };

  return (
    <div>
      <div>
        <h2>{currentMonth.name}</h2>
        <h4>Total Monthly Budget: ${currentMonthlyIncome}</h4>
        <h4>Remaining Buget for the month: ${currentRemainingBudget}</h4>

      </div>
      <hr></hr>

      <>
        {!currentId && !isCreate ? (
          <div>
            <button onClick={handleCreate}>Add New Budget</button> <hr></hr>
          </div>
        ) : null}
      </>

      <>
        {isCreate ? (
          <div>
            <form onSubmit={handleCreateSubmit}>
              <div>
                <label htmlFor="category">
                  <small>Category</small>
                </label>
                <select
                  name="category"
                  value={category}
                  onChange={handleChange}
                >
                  {allCategories.map(cat => {
                    return (
                      <option value={cat.name} key={cat.id}>
                        {cat.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label htmlFor="amount">
                  <small>Amount</small>
                </label>
                <input
                  name="amount"
                  type="text"
                  value={amount}
                  onChange={handleChange}
                />
              </div>
              <div>
                <button type="submit">Add Budget</button>
              </div>
              <div>
                <button onClick={handleCancel}>Cancel</button>
              </div>
              <hr></hr>
            </form>
          </div>
        ) : null}
      </>

      {allBudgets.map(bud => {
        if (currentId !== bud.id) {
          return (
            <div key={bud.id}>
              <form>
                <div>
                  <label htmlFor="category">
                    <small>Category</small>
                  </label>
                  <input
                    name="category"
                    type="text"
                    value={bud.category.name}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="amount">
                    <small>Amount</small>
                  </label>
                  <input
                    name="amount"
                    type="text"
                    value={bud.amount}
                    readOnly
                  />
                </div>
                <div>
                  {!currentId && !isCreate ? (
                    <button onClick={handleEdit(bud)}>Select to Edit</button>
                  ) : null}
                </div>
                <div>
                  {!currentId && !isCreate ? (
                    <button onClick={handleDelete(bud)}>Delete</button>
                  ) : null}
                </div>
              </form>
            </div>
          );
        } else {
          return (
            <div key={bud.id}>
              <form onSubmit={handleUpdateSubmit}>
                <div>
                  <label htmlFor="category">
                    <small>Category</small>
                  </label>
                  <select
                    name="category"
                    value={category}
                    onChange={handleChange}
                  >
                    {allCategories.map(cat => {
                      return (
                        <option value={cat.name} key={cat.id}>
                          {cat.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label htmlFor="amount">
                    <small>Amount</small>
                  </label>
                  <input
                    name="amount"
                    type="text"
                    value={amount}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <button type="submit">Update</button>
                </div>
                <div>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Budgets;
