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
import { months } from "../helpers";

/*
Page notes
1) can only create a budget for a category once
2) need to delete/update if you want to change categoryes around
3) created date will default to the selected month and year
*/

const Budgets = () => {
  const dispatch = useDispatch();
  const years = {};

  //all states
  const [currentId, setCurrentId] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isCreate, setIsCreate] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

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
  const currentMonthlyIncome = allMonthlyIncomes.filter(inc => {
    if (selectedYear && selectedMonth) {
      const tmpDate = new Date(`${selectedMonth}/1/${selectedYear}`);

      return compareDates(inc.createdAt, tmpDate);
    } else {
      return compareDates(inc.createdAt, currentDate.full);
    }
  });

  const filteredBudgets = allBudgets.filter(bud => {
    const tmpDate = new Date(bud.createdAt);
    const year = tmpDate.getFullYear();
    const month = tmpDate.getMonth() + 1;

    //Puts the current year with the an array of all the currentMonths for the year. No duplicates in the object or array.
    if (!years[`${year}`]) {
      years[`${year}`] = [month];
    } else if (!years[`${year}`].includes(month)) {
      years[`${year}`].push(month);
    }

    if (year === selectedYear && month === selectedMonth) {
      return true;
    } else {
      return false;
    }
  });

  const currentTotalBudgetAmount = filteredBudgets.reduce(
    (accu, bud) => accu + parseFloat(bud.amount),
    0
  );
  const currentRemainingBudget = (
    monthlyIncome - currentTotalBudgetAmount
  ).toFixed(2);

  const allocatedCategories = filteredBudgets.map(bud => bud.category.name);
  const remainingCategoriesWithCurrent = allCategories.filter(
    cat => !allocatedCategories.includes(cat.name) || cat.name === category
  );
  const remainingCategories = allCategories.filter(
    cat => !allocatedCategories.includes(cat.name)
  );

  useEffect(() => {
    dispatch(_getBudgets());
    dispatch(_getCategories());
    dispatch(setDate());
    dispatch(_getMonthlyIncomes());
  }, []);

  useEffect(() => {
    if (currentMonthlyIncome.length) {
      if (!monthlyIncome) {
        setSelectedYear(currentDate.year);
        setSelectedMonth(currentDate.num);
      }
      setMonthlyIncome(parseInt(currentMonthlyIncome[0].amount).toFixed(2));
    }
  }, [currentMonthlyIncome]);

  //legend to help call the setstate functions
  const legend = {
    currentId: setCurrentId,
    amount: setAmount,
    category: setCategory,
    isCreate: setIsCreate,
    budgetCreatedAt: setBudgetCreatedAt,
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

    const createDate = new Date(`${selectedMonth}/1/${selectedYear}`);

    const newBud = {
      amount,
      category,
      createdAt: createDate,
    };

    dispatch(_createBudget(newBud));

    clearState();
  };

  const handleCreate = evt => {
    evt.preventDefault();

    setIsCreate(true);
    setCategory(remainingCategories[0].name);
  };

  //Event handler for dropdown
  const handleMonthChange = evt => {
    setSelectedMonth(parseInt(evt.target.value));
  };

  const handleYearChange = evt => {
    const evtYear = parseInt(evt.target.value);

    setSelectedYear(evtYear);

    if (evtYear === currentDate.year) {
      setSelectedMonth(currentDate.num);
    } else {
      setSelectedMonth(years[evtYear][0]);
    }
  };

  const currentMonths = years[selectedYear] || [];
  currentMonths.sort((a, b) => a - b);

  return (
    <div>
      <div>
        <h2>
          {months[selectedMonth - 1]} {selectedYear}
        </h2>
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
        <label htmlFor="DropDownMonth">
          <small>Select Month </small>
        </label>
        <select
          name="DropDownMonth"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {currentMonths.map((month, idx) => (
            <option key={idx} value={month}>
              {month}
            </option>
          ))}
        </select>

        <label htmlFor="DropDownYear">
          <small>Select Year </small>
        </label>
        <select
          name="DropDownYear"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {Object.entries(years).map(year => (
            <option key={year[1]} value={year[0]}>
              {year[0]}
            </option>
          ))}
        </select>
      </div>

      {filteredBudgets.map(bud => {
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
                    {remainingCategoriesWithCurrent.map(cat => {
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
