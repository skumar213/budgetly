import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import history from "../history";
import { _getExpenses, _updateExpense, _createExpense, _deleteExpense} from "../store/expenses";

const UserProfile = () => {
  const dispatch = useDispatch();
  const allExpenses = useSelector(state => state.expenses);

  




  return (
    <div>Expenses</div>
  );
};

export default UserProfile;
