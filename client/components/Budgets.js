import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  _getBudgets,
  _updateBudget,
  _createBudget,
  _deleteBudget,
} from "../store/budgets";
import { _getCategories } from "../store/categories";
import {
  sortSingle,
  sortDouble,
  dateFilter,
  months,
  getTotal,
} from "../helpers";
import { setDate } from "../store/date";
import { _getMonthlyIncomes } from "../store/monthlyIncomes";

const Budgets = () => {
  const dispatch = useDispatch();
  const years = {};

  //redux states
  const currentDate = useSelector(state => state.date);
  const allMonthlyIncomes = useSelector(state => state.monthlyIncomes);
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

  //local states
  const [currentId, setCurrentId] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isCreate, setIsCreate] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentMonths, setCurrentMonths] = useState([]);

  //data from redux state organized as needed for page
  const currentMonthlyIncome = dateFilter(
    allMonthlyIncomes,
    selectedMonth,
    selectedYear,
    currentDate,
    "createdAt"
  );

  allBudgets.forEach(bud => {
    const tmpDate = new Date(bud.createdAt);
    const year = tmpDate.getFullYear();
    const month = tmpDate.getMonth() + 1;

    //Puts the current year with the an array of all the currentMonths for the year. No duplicates in the object or array.
    if (!years[`${year}`]) {
      years[`${year}`] = [month];
    } else if (!years[`${year}`].includes(month)) {
      years[`${year}`].push(month);
    }
  });

  const filteredBudgets = dateFilter(
    allBudgets,
    selectedMonth,
    selectedYear,
    currentDate,
    "createdAt"
  );

  if (!filteredBudgets.length) years[currentDate.year] = [currentDate.num];

  Object.values(years).forEach(yearMonths => {
    yearMonths.sort((a, b) => a - b);
  });

  const currentTotalBudgetAmount = getTotal(filteredBudgets);
  const currentRemainingBudget = (
    monthlyIncome - currentTotalBudgetAmount
  ).toFixed(2);

  const allocatedCategories = filteredBudgets.map(bud => bud.category.name);

  //will show remaining categories or the currently selected category in the category dropdown
  const remainingCategoriesWithCurrent = allCategories.filter(
    cat => !allocatedCategories.includes(cat.name) || cat.name === category
  );
  const remainingCategories = allCategories.filter(
    cat => !allocatedCategories.includes(cat.name)
  );

  //useEffects to fetch data and set the income/month/year/currentMonths
  useEffect(() => {
    dispatch(_getBudgets());
    dispatch(_getCategories());
    dispatch(setDate());
    dispatch(_getMonthlyIncomes());
  }, []);

  //sets the current monthly income
  useEffect(() => {
    if (currentMonthlyIncome.length) {
      if (!monthlyIncome) {
        setSelectedYear(currentDate.year);
        setSelectedMonth(currentDate.num);
      }
      setMonthlyIncome(parseInt(currentMonthlyIncome[0].amount).toFixed(2));
    }
  }, [currentMonthlyIncome]);

  //for the current year it will show from jan to current month
  //but for previous years it will show the starting month to december
  useEffect(() => {
    if (currentDate.year === selectedYear) {
      setCurrentMonths(Array.from(Array(currentDate.num).keys()));
    } else {
      const idx = (years[selectedYear] ? years[selectedYear][0] : null) || 1;
      setCurrentMonths(Array.from(Array(12).keys()).slice(idx - 1));
    }
  }, [selectedYear]);

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

  //event handler for changing all forms
  const handleChange = evt => {
    const fn = legend[evt.target.name];
    fn(evt.target.value);
  };

  //event handler for cancelling form edit
  const handleCancel = evt => {
    evt.preventDefault();

    clearState();
  };

  //UPDATE event handlers
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

  //DELETE event handler
  const handleDelete = bud => evt => {
    evt.preventDefault();

    dispatch(_deleteBudget(bud));
  };

  //CREATE Event handler
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

  //Event handlers for month & year dropdown
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

  return (
    <div id="content">
      <div className="container-fluid">
        <h3 className="text-dark mb-4 m-3">Budgets</h3>
        <div className="card shadow">
          <div className="card-header py-3">
            <p className="text-primary m-0 fw-bold">
              {months[selectedMonth - 1]} {selectedYear}
            </p>
            <p className="text-primary m-0 fw-bold">
              Total Budget: ${monthlyIncome}
            </p>
            <p className="text-primary m-0 fw-bold">
              Remaining Budget: ${currentRemainingBudget}
            </p>
          </div>
          <p className="text-center m-0" style={{ fontSize: 12 }}>
            *Note: A budget category can only be added once and budget will be
            added to the selected date/year
          </p>

          <div className="card-body">
            <div className="row">
              <div className="col-md-6 text-nowrap">
                <div
                  id="dataTable_length"
                  className="dataTables_length"
                  aria-controls="dataTable"
                >
                  <label htmlFor="DropDownMonth" className="form-label">
                    <small>Select Month </small>
                    <select
                      className="form-select-sm d-block form-select form-select-sm"
                      name="DropDownMonth"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                    >
                      {currentMonths.map((month, idx) => (
                        <option key={idx} value={month + 1}>
                          {month + 1}
                        </option>
                      ))}
                    </select>
                  </label>
                      
                  <label htmlFor="DropDownYear" className="form-label">
                    <small>Select Year </small>
                    <select
                      className="form-select-sm d-block form-select form-select-sm"
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
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  id="dataTable_filter"
                  className="text-md-end dataTables_filter"
                >
                  {!currentId &&
                  !isCreate &&
                  allocatedCategories.length !== allCategories.length ? (
                    <div className="mt-3">
                      <button
                        onClick={handleCreate}
                        className="btn btn-primary py-0"
                      >
                        Add New Budget
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div
              id="dataTable"
              className="table-responsive table mt-2"
              role="grid"
              aria-describedby="dataTable_info"
            >
              <form
                onSubmit={isCreate ? handleCreateSubmit : handleUpdateSubmit}
              >
                <table id="dataTable" className="table my-0">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isCreate ? (
                      <tr>
                        <td>
                          <select
                            name="category"
                            value={category}
                            onChange={handleChange}
                            required
                          >
                            {allCategories
                              .filter(
                                cat => !allocatedCategories.includes(cat.name)
                              )
                              .map(cat => {
                                return (
                                  <option value={cat.name} key={cat.id}>
                                    {cat.name}
                                  </option>
                                );
                              })}
                          </select>
                        </td>
                        <td>
                          <input
                            name="amount"
                            type="number"
                            value={amount}
                            onChange={handleChange}
                            required
                          />
                        </td>
                        <td>
                          <button
                            type="submit"
                            className="btn btn-success py-0"
                          >
                            Add Budget
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={handleCancel}
                            className="btn btn-primary py-0"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ) : null}

                    {filteredBudgets.map(bud => {
                      if (currentId !== bud.id) {
                        return (
                          <tr key={bud.id}>
                            <td>
                              <input
                                className="border-0"
                                name="category"
                                type="text"
                                value={bud.category.name}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                className="border-0"
                                name="amount"
                                type="number"
                                value={bud.amount}
                                readOnly
                              />
                            </td>
                            <td>
                              {!currentId && !isCreate ? (
                                <button
                                  onClick={handleEdit(bud)}
                                  className="btn btn-success py-0"
                                >
                                  Edit
                                </button>
                              ) : null}
                            </td>
                            <td>
                              {!currentId && !isCreate ? (
                                <button
                                  onClick={handleDelete(bud)}
                                  className="btn btn-danger py-0"
                                >
                                  Delete
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr key={bud.id}>
                            <td>
                              <div>
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
                            </td>
                            <td>
                              <input
                                name="amount"
                                type="number"
                                value={amount}
                                onChange={handleChange}
                              />
                            </td>
                            <td>
                              <button
                                type="submit"
                                className="btn btn-success py-0"
                              >
                                Update
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={handleCancel}
                                className="btn btn-primary py-0"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
