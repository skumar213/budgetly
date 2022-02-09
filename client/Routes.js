import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { Login, Signup } from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import UserProfile from "./components/UserProfile";
import Expenses from "./components/Expenses";
import Budgets from "./components/Budgets";
import Investments from "./components/Investments";
import { me } from "./store/auth";
import { _getMonthlyIncomes, _createMonthlyIncome } from "./store/monthlyIncomes";
import { compareDates, sortSingle } from "./helpers";
import { setDate } from "./store/date";

const Routes = props => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => !!state.auth.id);
  const currentDate = useSelector(state => state.date);
  const monthlyIncomes = sortSingle(
    useSelector(state => state.monthlyIncomes),
    "createdAt"
  );
  const thisMonthIncome = monthlyIncomes.filter(inc =>
    compareDates(inc.createdAt, currentDate.full)
  );

  useEffect(() => {
    if (monthlyIncomes.length && !thisMonthIncome.length) {
      const lastMonthIncome = monthlyIncomes[monthlyIncomes.length - 1];

      dispatch(_createMonthlyIncome({amount: lastMonthIncome.amount}))
    }
  }, [thisMonthIncome]);

  useEffect(() => {
    dispatch(me());
    dispatch(_getMonthlyIncomes());
    dispatch(setDate());
  }, []);

  return (
    <div id="content-wrapper" className="d-flex flex-column">
      {isLoggedIn ? (
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/user" component={UserProfile} />
          <Route path="/expenses" component={Expenses} />
          <Route path="/budgets" component={Budgets} />
          <Route path="/investments" component={Investments} />
          <Redirect to="/dashboard" />
        </Switch>
      ) : (
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </Switch>
      )}
    </div>
  );
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(Routes);
