import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { Login, Signup } from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import UserProfile from "./components/UserProfile";
import Expenses from "./components/Expenses";
import Budgets from "./components/Budgets";
import Investments from "./components/Investments";
import { me } from "./store/auth";
import {
  _getMonthlyIncomes,
  _createMonthlyIncome,
} from "./store/monthlyIncomes";
import { sortSingle, dateFilter } from "./helpers";
import { setDate } from "./store/date";
import { _getBudgets, _createBudget } from "./store/budgets";

const Routes = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => !!state.auth.id);
  const currentDate = useSelector(state => state.date);

  const monthlyIncomes = sortSingle(
    useSelector(state => state.monthlyIncomes),
    "createdAt"
  );

  const thisMonthIncome = dateFilter(
    monthlyIncomes,
    null,
    null,
    currentDate,
    "createdAt"
  );

  useEffect(() => {
    //will create a duplicate of last months income for the current month
    if (monthlyIncomes.length && !thisMonthIncome.length) {
      const lastMonthIncome = monthlyIncomes[monthlyIncomes.length - 1];
      const lastMonthDate = new Date(lastMonthIncome.createdAt);
      lastMonthDate.setMonth(lastMonthDate.getMonth() + 1);

      dispatch(
        _createMonthlyIncome({
          amount: lastMonthIncome.amount,
          createdAt: lastMonthDate,
        })
      );
    }
  }, [thisMonthIncome]);

  useEffect(() => {
    dispatch(me());
    dispatch(setDate());

    if (isLoggedIn) {
      dispatch(_getMonthlyIncomes());
      dispatch(_getBudgets());
    }
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
