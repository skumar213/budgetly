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
      <>
        {!currentId && !isCreate ? (
          <div>
            <div>
              <button onClick={handleCreate}>Add New Expense</button>
            </div>
            <br></br>

            <form>
              <label htmlFor="sort">
                <strong>Sort</strong>
              </label>
              <select name="sort" value={filterType} onChange={handleChange}>
                <option value="all">All</option>
                <option value="outstanding">Outstanding</option>
                <option value="paid">Paid</option>
              </select>
            </form>
            <hr></hr>
          </div>
        ) : null}
      </>

      <>
        {isCreate ? (
          <div>
            <form onSubmit={handleCreateSubmit}>
              <div>
                <label htmlFor="merchant">
                  <small>Merchant</small>
                </label>
                <input
                  name="merchant"
                  type="text"
                  value={merchant}
                  onChange={handleChange}
                />
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
                <label htmlFor="dueDate">
                  <small>dueDate</small>
                </label>
                <input
                  name="dueDate"
                  type="text"
                  value={dueDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="paidDate">
                  <small>paidDate</small>
                </label>
                <input
                  name="paidDate"
                  type="paidDate"
                  value={paidDate ? paidDate : ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="isRepeat">
                  <small>Repeat</small>
                </label>
                <input
                  name="isRepeat"
                  type="checkbox"
                  value={isRepeat}
                  onChange={handleChange}
                />
              </div>
              <div>
                <button type="submit">Add Expense</button>
              </div>
              <div>
                <button onClick={handleCancel}>Cancel</button>
              </div>
              <hr></hr>
            </form>
          </div>
        ) : null}
      </>

      {filteredExpenses.map(exp => {
        if (currentId !== exp.id) {
          return (
            <div key={exp.id}>
              <form>
                <div>
                  <label htmlFor="merchant">
                    <small>Merchant</small>
                  </label>
                  <input
                    name="merchant"
                    type="text"
                    value={exp.merchant}
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
                    value={exp.amount}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="category">
                    <small>Category</small>
                  </label>
                  <input
                    name="category"
                    type="text"
                    value={exp.category.name}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="dueDate">
                    <small>dueDate</small>
                  </label>
                  <input
                    name="dueDate"
                    type="text"
                    value={exp.dueDate}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="paidDate">
                    <small>paidDate</small>
                  </label>
                  <input
                    name="paidDate"
                    type="paidDate"
                    value={exp.paidDate ? exp.paidDate : ""}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="isRepeat">
                    <small>Repeat</small>
                  </label>
                  <input
                    name="isRepeat"
                    type="checkbox"
                    checked={exp.isRepeat}
                    readOnly
                  />
                </div>
                <div>
                  {!currentId && !isCreate ? (
                    <button onClick={handleEdit(exp)}>Select to Edit</button>
                  ) : null}
                </div>
                <div>
                  {!currentId && !isCreate ? (
                    <button onClick={handleDelete(exp)}>Delete</button>
                  ) : null}
                </div>
              </form>
            </div>
          );
        } else {
          return (
            <div key={exp.id}>
              <form onSubmit={handleUpdateSubmit}>
                <div>
                  <label htmlFor="merchant">
                    <small>Merchant</small>
                  </label>
                  <input
                    name="merchant"
                    type="text"
                    value={merchant}
                    onChange={handleChange}
                  />
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
                  <label htmlFor="dueDate">
                    <small>dueDate</small>
                  </label>
                  <input
                    name="dueDate"
                    type="text"
                    value={dueDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="paidDate">
                    <small>paidDate</small>
                  </label>
                  <input
                    name="paidDate"
                    type="paidDate"
                    value={paidDate ? paidDate : ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="isRepeat">
                    <small>Repeat</small>
                  </label>
                  <input
                    name="isRepeat"
                    type="checkbox"
                    checked={isRepeat}
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

export default Expenses;
