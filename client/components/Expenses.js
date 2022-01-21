import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import history from "../history";
import {
  _getExpenses,
  _updateExpense,
  _createExpense,
  _deleteExpense,
} from "../store/expenses";

const UserProfile = () => {
  const dispatch = useDispatch();
  const allExpenses = useSelector(state => state.expenses).expenses || [];

  const [currentId, setCurrentId] = useState("");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paidDate, setPaidDate] = useState("");
  const [isRepeat, setIsRepeat] = useState("");

  const legend = {
    merchant: setMerchant,
    amount: setAmount,
    dueDate: setDueDate,
    paidDate: setPaidDate,
    isRepeat: setIsRepeat,
  };

  useEffect(() => {
    dispatch(_getExpenses());
  }, []);

  const handleEdit = exp => evt => {
    evt.preventDefault();

    setCurrentId(Number(exp.id));
    setMerchant(exp.merchant);
    setAmount(exp.amount);
    setDueDate(exp.dueDate);
    setPaidDate(exp.paidDate);
    setIsRepeat(exp.isRepeat);

  };

  const handleChange = evt => {
    const fn = legend[evt.target.name];

    fn(evt.target.value);

  };

  const handleSubmit = evt => {
    evt.preventDefault();
    //In the handle submit remove the current id



  };


  console.log(allExpenses);

  return (
    <div>
      {allExpenses.map(exp => {
        if (currentId !== exp.id) {
          return (
            <div key={exp.id}>
              <form>
                <div>
                  <label htmlFor="merchant">
                    <small>Merchant</small>
                  </label>
                  <input name="merchant" type="text" value={exp.merchant} readOnly/>
                </div>
                <div>
                  <label htmlFor="amount">
                    <small>Amount</small>
                  </label>
                  <input name="amount" type="text" value={exp.amount} readOnly/>
                </div>
                <div>
                  <label htmlFor="dueDate">
                    <small>dueDate</small>
                  </label>
                  <input name="dueDate" type="text" value={exp.dueDate} readOnly/>
                </div>
                <div>
                  <label htmlFor="paidDate">
                    <small>paidDate</small>
                  </label>
                  <input name="paidDate" type="paidDate" value={exp.paidDate ? exp.paidDate : ""} readOnly/>
                </div>
                <div>
                  <label htmlFor="isRepeat">
                    <small>Repeat</small>
                  </label>
                  <input
                    name="isRepeat"
                    type="text"
                    value={exp.isRepeat ? "Yes" : "No"}
                    readOnly
                  />
                </div>
                <div>
                {!currentId ? (
                  <button onClick={handleEdit(exp)}>Select to Edit</button>
                ) : null}
              </div>
              </form>
            </div>
          )
        } else {
          return (
            <div key={exp.id}>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="merchant">
                    <small>Merchant</small>
                  </label>
                  <input name="merchant" type="text" value={merchant} onChange={handleChange}/>
                </div>
                <div>
                  <label htmlFor="amount">
                    <small>Last Name</small>
                  </label>
                  <input name="amount" type="text" value={amount} onChange={handleChange}/>
                </div>
                <div>
                  <label htmlFor="dueDate">
                    <small>dueDate</small>
                  </label>
                  <input name="dueDate" type="text" value={dueDate} onChange={handleChange}/>
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
                    type="text"
                    value={isRepeat ? "Yes" : "No"}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <button type="submit">Update</button>
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
