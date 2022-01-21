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

  const handleEdit = expId => evt => {
    evt.preventDefault();

    allExpenses.map(exp => {
      if (exp.id === expId) {
        exp.isForm = true;
      }

      return exp;
    });

    setCurrentId(Number(expId));
  };

  //In the handle submit you need to remove that property that tells it to be a form

  console.log(allExpenses);

  return (
    <div>
      {allExpenses.map(exp => {
        if (currentId !== exp.id) {
          return (
            <div key={exp.id}>
              <table>
                <tbody>
                  <tr>
                    <td>{exp.merchant}</td>
                    <td>{exp.amount}</td>
                    <td>{exp.dueDate}</td>
                    <td>{exp.paidDate ? exp.paidDate : ""}</td>
                    <td>{exp.isRepeat ? "Yes" : "No"}</td>
                    <td>{exp.isForm ? "form" : ""}</td>
                  </tr>
                </tbody>
              </table>
              <div>
                {!currentId ? (
                  <button onClick={handleEdit(exp.id)}>Edit</button>
                ) : null}
              </div>
            </div>
          );
        } else {
          return (
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
                  <input
                    name="paidDate"
                    type="paidDate"
                    value={exp.paidDate ? exp.paidDate : ""}
                  />
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
