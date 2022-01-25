import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import history from "../history";
import {
  _getExpenses,
  _updateExpense,
  _createExpense,
  _deleteExpense,
} from "../store/expenses";
import { _getCategories } from "../store/categories";

const UserProfile = () => {
  const dispatch = useDispatch();
  const allExpenses = useSelector(state => state.expenses) || [];
  const allCategories = useSelector(state => state.categories) || [];

  console.log(allCategories);

  const [currentId, setCurrentId] = useState("");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paidDate, setPaidDate] = useState("");
  const [isRepeat, setIsRepeat] = useState("");
  const [isCreate, setIsCreate] = useState("");

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

  const clearState = () => {
    for (let key in legend) {
      legend[key]("");
    }
  };

  useEffect(() => {
    dispatch(_getExpenses());
    dispatch(_getCategories());
  }, []);

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

  const handleChange = evt => {
    const fn = legend[evt.target.name];

    if (evt.target.name === "isRepeat") {
      fn(Boolean(evt.target.checked));
    } else {
      fn(evt.target.value);
    }
  };

  const handleUpdateSubmit = evt => {
    evt.preventDefault();

    const expToUpdate = {
      id: currentId,
      merchant,
      amount,
      category,
      dueDate,
      paidDate: paidDate ? paidDate : null,
      isRepeat,
    };

    dispatch(_updateExpense(expToUpdate));

    clearState();
  };

  const handleDelete = exp => evt => {
    evt.preventDefault();

    dispatch(_deleteExpense(exp));
  };

  const handleCancel = evt => {
    evt.preventDefault();

    clearState();
  };

  const handleCreateSubmit = evt => {
    evt.preventDefault();

    const newExp = {
      merchant,
      amount,
      category,
      dueDate,
      paidDate: paidDate ? paidDate : null,
      isRepeat: isRepeat ? true : false,
    };

    dispatch(_createExpense(newExp));

    clearState();
  };

  const handleCreate = evt => {
    evt.preventDefault();

    setIsCreate(true);
  };

  return (
    <div>
      <>
        {!currentId && !isCreate ? (
          <div>
            <button onClick={handleCreate}>Add New Expense</button> <hr></hr>
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
                  type="text"
                  value={amount}
                  onChange={handleChange}
                />
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

      {allExpenses.map(exp => {
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
                    type="text"
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
                    type="text"
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
                    defaultValue={category}
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

export default UserProfile;

/*
(
          <div key={exp.id}>
            <form>
              <div>
                <label htmlFor="merchant">
                  <small>Merchant</small>
                </label>
                <input name="merchant" type="text" value={exp.merchant} />
              </div>
              <div>
                <label htmlFor="amount">
                  <small>Last Name</small>
                </label>
                <input name="amount" type="text" value={exp.amount} />
              </div>
              <div>
                <label htmlFor="dueDate">
                  <small>dueDate</small>
                </label>
                <input name="dueDate" type="text" value={exp.dueDate} />
              </div>
              <div>
                <label htmlFor="paidDate">
                  <small>paidDate</small>
                </label>
                <input name="paidDate" type="paidDate" value={exp.paidDate ? exp.paidDate : ""} />
              </div>
              <div>
                <label htmlFor="isRepeat">
                  <small>Repeat</small>
                </label>
                <input
                  name="isRepeat"
                  type="text"
                  value={exp.isRepeat ? "Yes" : "No"}
                />
              </div>
              <div>
                <button type="submit">Edit</button>
              </div>
            </form>
          </div>
        )
*/

/*

<div>
                {!currentId ? (
                  <button onClick={handleEdit(exp.id)}>Edit</button>
                ) : null}
              </div>

*/
