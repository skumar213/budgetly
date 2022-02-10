import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { _getBudgets } from "../store/budgets";
import { _getExpenses } from "../store/expenses";
import { setDate } from "../store/date";
import { _getMonthlyIncomes } from "../store/monthlyIncomes";
import { _getCategories } from "../store/categories";
import { _getInvestments } from "../store/investments";
import { sortSingle, sortDouble, compareDates, dateFilter } from "../helpers";

const Dashboard = () => {
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
  const allExpenses =
    sortSingle(
      useSelector(state => state.expenses),
      "dueDate"
    ) || [];

  const allInvestments = sortSingle(
    useSelector(state => state.investments),
    "tickerSymbol"
  );

  //local states
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  //data from redux state organized as needed for page
  const selectedMonthlyIncome = dateFilter(
    allMonthlyIncomes,
    selectedMonth,
    selectedYear,
    currentDate
  );
  const selectedBudgets = dateFilter(
    allBudgets,
    selectedMonth,
    selectedYear,
    currentDate
  )


  console.log(allBudgets)


  useEffect(() => {
    dispatch(_getBudgets());
    dispatch(_getInvestments());
    dispatch(_getMonthlyIncomes());
    dispatch(_getExpenses());
    dispatch(setDate());
    dispatch(_getCategories());
  }, []);

  // console.log(currentDate)

  return (
    <div id="container-fluid">
      <div className="container-fluid">
        <div className="d-sm-flex justify-content-between align-items-center mb-4">
          <h3 className="text-dark mb-0">Dashboard</h3>
        </div>
        <div className="row">
          <div className="col-md-6 col-xl-3 mb-4">
            <div className="card shadow border-start-primary py-2">
              <div className="card-body">
                <div className="row align-items-center no-gutters">
                  <div className="col me-2">
                    <div className="text-uppercase text-primary fw-bold text-xs mb-1">
                      <span>Total Budget (monthly)</span>
                    </div>
                    <div className="text-dark fw-bold h5 mb-0">
                      {/* <span>${monthlyIncome.toFixed(2)}</span> */}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-calendar fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3 mb-4">
            <div className="card shadow border-start-success py-2">
              <div className="card-body">
                <div className="row align-items-center no-gutters">
                  <div className="col me-2">
                    <div className="text-uppercase text-success fw-bold text-xs mb-1">
                      <span>Remaining Budget (monthly)</span>
                    </div>
                    <div className="text-dark fw-bold h5 mb-0">
                      <span>
                        {/* {monthlyIncome - totalBudget >= 0 ? (
                          <span>
                            ${(monthlyIncome - totalBudget).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-danger">
                            ${(monthlyIncome - totalBudget).toFixed(2)}
                          </span>
                        )} */}
                      </span>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3 mb-4">
            <div className="card shadow border-start-primary py-2">
              <div className="card-body">
                <div className="row align-items-center no-gutters">
                  <div className="col me-2">
                    <div className="text-uppercase text-info fw-bold text-xs mb-1">
                      <span>Expected Expenses (monthly)</span>
                    </div>
                    <div className="text-dark fw-bold h5 mb-0 me-3">
                      <span>$40,000</span>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3 mb-4">
            <div className="card shadow border-start-primary py-2">
              <div className="card-body">
                <div className="row align-items-center no-gutters">
                  <div className="col me-2">
                    <div className="text-uppercase text-warning fw-bold text-xs mb-1">
                      <span>Total Portfolio Value</span>
                    </div>
                    <div className="text-dark fw-bold h5 mb-0">
                      <span>$40,000</span>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-calendar fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
