import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  _getExpenses,
  _updateExpense,
  _createExpense,
  _deleteExpense,
} from "../store/expenses";
import { _getCategories } from "../store/categories";
import { sortSingle } from "../helpers";

const Expenses = () => {
  const dispatch = useDispatch();

  //redux states
  const allExpenses =
    sortSingle(
      useSelector(state => state.expenses),
      "dueDate"
    ) || [];

  const allCategories =
    sortSingle(
      useSelector(state => state.categories),
      "name"
    ) || [];

  //local states
  const [currentId, setCurrentId] = useState("");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paidDate, setPaidDate] = useState("");
  const [isRepeat, setIsRepeat] = useState("");
  const [isCreate, setIsCreate] = useState("");
  const [filterType, setFilterType] = useState("outstanding");

  //data from redux state organized as needed for page
  const filteredExpenses = allExpenses.filter(exp => {
    if (filterType === "paid") {
      return exp.paidDate;
    } else if (filterType === "outstanding") {
      return !exp.paidDate;
    } else {
      return exp;
    }
  });

  if (filterType === "paid") sortSingle(filteredExpenses, "paidDate");

  //useEffect to fetch data
  useEffect(() => {
    dispatch(_getExpenses());
    dispatch(_getCategories());
  }, []);

  //legend to help call the setstate functions
  const legend = {
    merchant: setMerchant,
    amount: setAmount,
    category: setCategory,
    dueDate: setDueDate,
    paidDate: setPaidDate,
    isRepeat: setIsRepeat,
    currentId: setCurrentId,
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

    if (evt.target.name === "isRepeat") {
      fn(Boolean(evt.target.checked));
    } else if (evt.target.name === "sort") {
      setFilterType(evt.target.value);
    } else {
      fn(evt.target.value);
    }
  };

  //event handler for cancelling form edit
  const handleCancel = evt => {
    evt.preventDefault();

    clearState();
  };

  //UPDATE event handlers
  const handleEdit = exp => evt => {
    evt.preventDefault();

    setCurrentId(Number(exp.id));
    setMerchant(exp.merchant);
    setAmount(exp.amount);
    setCategory(exp.category.name);
    setDueDate(exp.dueDate);
    setPaidDate(exp.paidDate);
    setIsRepeat(exp.isRepeat);
  };

  const handleUpdateSubmit = evt => {
    evt.preventDefault();

    const oldPaidDate = allExpenses.filter(exp => exp.id === currentId)[0]
      .paidDate;

    const currentDueDate = new Date(dueDate);
    const newDueDate = currentDueDate.setMonth(currentDueDate.getMonth() + 1);

    const expToUpdateRepeat = {
      id: currentId,
      merchant,
      amount,
      category,
      dueDate,
      paidDate,
      isRepeat: false,
    };

    const expToCreateRepeat = {
      merchant,
      amount,
      category,
      dueDate: newDueDate,
      isRepeat,
    };

    const expToUpdate = {
      id: currentId,
      merchant,
      amount,
      category,
      dueDate,
      paidDate: paidDate ? paidDate : null,
      isRepeat,
    };

    //creates a duplicate expense if its a repeat
    //also will prevent setting repeat if its paid
    if (paidDate && !oldPaidDate && isRepeat) {
      dispatch(_updateExpense(expToUpdateRepeat));

      dispatch(_createExpense(expToCreateRepeat));
    } else if (paidDate) {
      delete expToUpdate.isRepeat;
      dispatch(_updateExpense(expToUpdate));
    } else {
      dispatch(_updateExpense(expToUpdate));
    }

    clearState();
  };

  //DELETE event handler
  const handleDelete = exp => evt => {
    evt.preventDefault();

    dispatch(_deleteExpense(exp));
  };

  //CREATE event handler
  const handleCreateSubmit = evt => {
    evt.preventDefault();

    const currentDueDate = new Date(dueDate);
    let newDueDate;
    if (isRepeat) {
      newDueDate = currentDueDate.setMonth(currentDueDate.getMonth() + 1);
    }

    const newExp = {
      merchant,
      amount,
      category,
      dueDate: currentDueDate,
      paidDate: paidDate ? paidDate : null,
      isRepeat: isRepeat ? true : false,
    };

    const newExpPaid = {
      merchant,
      amount,
      category,
      dueDate: currentDueDate,
      paidDate: paidDate ? paidDate : null,
    };

    const newExpRepeat = {
      merchant,
      amount,
      category,
      dueDate: newDueDate,
      isRepeat: isRepeat ? true : false,
    };

    //if an expense is made with a paid date and repeat it will create a duplicate a month
    if (paidDate && isRepeat) {
      dispatch(_createExpense(newExpPaid));
      dispatch(_createExpense(newExpRepeat));
    } else {
      dispatch(_createExpense(newExp));
    }

    clearState();
  };

  const handleCreate = evt => {
    evt.preventDefault();

    setIsCreate(true);
    setCategory(allCategories[0].name);
  };

  return (
    <div>
      <div id="content">
        <div className="container-fluid">
          <h3 className="text-dark mb-4 m-3">Expenses</h3>
          <div className="card shadow">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 text-nowrap">
                  <div
                    id="dataTable_length"
                    className="dataTables_length"
                    aria-controls="dataTable"
                  >
                    <label htmlFor="sort" className="form-label">
                      <strong>Sort </strong>

                      <select
                        className="d-inline-block form-select form-select-sm"
                        name="sort"
                        value={filterType}
                        onChange={handleChange}
                      >
                        <option value="all">All</option>
                        <option value="outstanding">Outstanding</option>
                        <option value="paid">Paid</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    id="dataTable_filter"
                    className="text-md-end dataTables_filter"
                  >
                    {!currentId && !isCreate ? (
                          <button
                            onClick={handleCreate}
                            className="btn btn-primary py-0"
                          >
                            Add New Expense
                          </button>
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
                        <th>Merchant</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Due Date</th>
                        <th>Paid Date</th>
                        <th>Repeat</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {isCreate ? (
                          <tr>
                            <td>
                              <input
                                name="merchant"
                                type="text"
                                value={merchant}
                                onChange={handleChange}
                                required
                              />
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
                            </td>
                            <td>
                              <input
                                name="dueDate"
                                type="date"
                                value={dueDate}
                                onChange={handleChange}
                                required
                              />
                            </td>
                            <td>
                              <input
                                name="paidDate"
                                type="date"
                                value={paidDate ? paidDate : ""}
                                onChange={handleChange}
                              />
                            </td>
                            <td>
                              <input
                                name="isRepeat"
                                type="checkbox"
                                value={isRepeat}
                                onChange={handleChange}
                              />
                            </td>
                            <td>
                              <button
                                type="submit"
                                className="btn btn-success py-0"
                              >
                                Add Expense
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
                      </>

                      {filteredExpenses.map(exp => {
                        if (currentId !== exp.id) {
                          return (
                            <tr key={exp.id}>
                              <td>
                                <input
                                  className="border-0"
                                  name="merchant"
                                  type="text"
                                  value={exp.merchant}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="border-0"
                                  name="amount"
                                  type="number"
                                  value={exp.amount}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="border-0"
                                  name="category"
                                  type="text"
                                  value={exp.category.name}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="border-0"
                                  name="dueDate"
                                  type="text"
                                  value={exp.dueDate}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="border-0"
                                  name="paidDate"
                                  type="paidDate"
                                  value={exp.paidDate ? exp.paidDate : ""}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="border-0"
                                  name="isRepeat"
                                  type="checkbox"
                                  checked={exp.isRepeat}
                                  readOnly
                                />
                              </td>
                              <td>
                                {!currentId && !isCreate ? (
                                  <button
                                    onClick={handleEdit(exp)}
                                    className="btn btn-success py-0"
                                  >
                                    Edit
                                  </button>
                                ) : null}
                              </td>
                              <td>
                                {!currentId && !isCreate ? (
                                  <button
                                    onClick={handleDelete(exp)}
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
                            <tr key={exp.id}>
                              <td>
                                <input
                                  name="merchant"
                                  type="text"
                                  value={merchant}
                                  onChange={handleChange}
                                />
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
                              </td>
                              <td>
                                <input
                                  name="dueDate"
                                  type="text"
                                  value={dueDate}
                                  onChange={handleChange}
                                />
                              </td>
                              <td>
                                <input
                                  name="paidDate"
                                  type="paidDate"
                                  value={paidDate ? paidDate : ""}
                                  onChange={handleChange}
                                />
                              </td>
                              <td>
                                <input
                                  name="isRepeat"
                                  type="checkbox"
                                  checked={isRepeat}
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
    </div>
  );
};

export default Expenses;
