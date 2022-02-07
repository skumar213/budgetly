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
import { sortSingle, sortDouble, compareDates } from "../helpers";
import { setDate } from "../store/date";
import { _getMonthlyIncomes } from "../store/monthlyIncomes";

const Budgets = () => {
  const dispatch = useDispatch();
  //all states
  const [currentId, setCurrentId] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isCreate, setIsCreate] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");

  const allCategories =
    sortSingle(
      useSelector(state => state.categories),
      "name"
    ) || [];

  const allBudgets =
    sortDouble(
      useSelector(state => state.budgets),
      "category",
      "name"
    ) || [];

  const currentDate = useSelector(state => state.date);
  const allMonthlyIncomes = useSelector(state => state.monthlyIncomes);
  const currentMonthlyIncome = allMonthlyIncomes.filter(inc =>
    compareDates(inc.createdAt, currentDate.full)
  );

  const currentTotalBudgetAmount = allBudgets.reduce(
    (accu, bud) => accu + parseFloat(bud.amount),
    0
  );
  const currentRemainingBudget = (
    monthlyIncome - currentTotalBudgetAmount
  ).toFixed(2);
  const allocatedCategories = allBudgets.map(bud => bud.category.name);

  useEffect(() => {
    dispatch(_getBudgets());
    dispatch(_getCategories());
    dispatch(setDate());
    dispatch(_getMonthlyIncomes());
  }, []);

  useEffect(() => {
    if (currentMonthlyIncome.length && !monthlyIncome) {
      setMonthlyIncome(parseInt(currentMonthlyIncome[0].amount).toFixed(2));
    }
  }, [currentMonthlyIncome]);

  //legend to help call the setstate functions
  const legend = {
    currentId: setCurrentId,
    amount: setAmount,
    category: setCategory,
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

    setCurrentId(parseInt(bud.id));
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

  return (
    <div>
      <div>
        <h2>{currentDate.name}</h2>
        <h4>Total Monthly Budget: ${monthlyIncome}</h4>
        <h4>Remaining Budget for the Month: ${currentRemainingBudget}</h4>
        <hr></hr>
      </div>

      <>
        {!currentId &&
        !isCreate &&
        allocatedCategories.length !== allCategories.length ? (
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
                  {allCategories
                    .filter(cat => !allocatedCategories.includes(cat.name))
                    .map(cat => {
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
                  type="number"
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

      <div>
        <label htmlFor="incomeDropDownMonth">
          <small>Select Month </small>
        </label>

        <select
          name="incomeDropDownMonth"
          // value={incomeId}
          // onChange={handeIncomeChange}
        >
          {/* {allDatesForIncomes.map(date => {
            const month = date.date.split("/")[0];

            return (
              <option key={date.id} value={date.id}>
                {month}
              </option>
            );
          })} */}
        </select>

        <label htmlFor="incomeDropDownYear">
          <small>Select Year </small>
        </label>
        <select
          name="incomeDropDownYear"
          // value={selectedYear}
          // onChange={handeIncomeYearChange}
        >
          {/* {Object.entries(years).map(year => (
            <option key={year[1]} value={year[0]}>
              {year[0]}
            </option>
          ))} */}
        </select>
      </div>

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
                    type="number"
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
                    type="number"
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
