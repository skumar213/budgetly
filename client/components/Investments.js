import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import history from "../history";
import {
  _getInvestments,
  _updateInvestment,
  _createInvestment,
  _deleteInvestment,
} from "../store/investments";
import { sortSingle } from "../helpers";


const Investments = () => {
  const dispatch = useDispatch();
  const allInvestments = useSelector(state => state.investments)

  useEffect(() => {
    dispatch(_getInvestments());
  }, []);




  return <div>Investments</div>

}

export default Investments
