import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { _getBudgets } from "../store/budgets";
import { _getExpenses } from "../store/expenses";
import { setDate } from "../store/date";
import { _getMonthlyIncomes } from "../store/monthlyIncomes";
import { _getCategories } from "../store/categories";
import { _getInvestments, getInvestmentsPrice } from "../store/investments";
import {
  sortSingle,
  sortDouble,
  dateFilter,
  getTotal,
  findUnique,
  pieChart,
  colors,
  barChart,
  horizontalBarChart,
} from "../helpers";
import { STOCKS } from "../store/auth";

//set it to false for development to save on yahoo finance api calls
const triggerForYahoo = true;

const Dashboard = () => {
  const dispatch = useDispatch();
  const years = {};
  const selectedExpensesDueOrPaid = {};

  //redux states
  const currentDate = useSelector(state => state.date);
  const allMonthlyIncomes = useSelector(state => state.monthlyIncomes);
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
  const [currentMonths, setCurrentMonths] = useState([]);
  const [pieGraph, setPieGraph] = useState("");
  const [barGraph, setBarGraph] = useState("");
  const [horizontalBarGraph, setHorizontalBarGraph] = useState("");

  //data from redux state organized as needed for page
  const selectedMonthlyIncome = dateFilter(
    allMonthlyIncomes,
    selectedMonth,
    selectedYear,
    currentDate,
    "createdAt"
  )[0] || { amount: 0 };
  const selectedBudgets = dateFilter(
    allBudgets,
    selectedMonth,
    selectedYear,
    currentDate,
    "createdAt"
  );
  const selectedExpensesDue = dateFilter(
    allExpenses,
    selectedMonth,
    selectedYear,
    currentDate,
    "dueDate"
  );
  const selectedExpensesPaid = dateFilter(
    allExpenses,
    selectedMonth,
    selectedYear,
    currentDate,
    "paidDate"
  );

  selectedExpensesDue.forEach(dueExp => {
    if (!selectedExpensesDueOrPaid[dueExp.id]) {
      selectedExpensesDueOrPaid[dueExp.id] = dueExp;
    }
  });
  selectedExpensesPaid.forEach(paidExp => {
    if (!selectedExpensesDueOrPaid[paidExp.id]) {
      selectedExpensesDueOrPaid[paidExp.id] = paidExp;
    }
  });

  allMonthlyIncomes.forEach(inc => {
    const tmpDate = new Date(inc.createdAt);
    const year = tmpDate.getFullYear();
    const month = tmpDate.getMonth() + 1;

    //Puts the current year with the an array of all the currentMonths for the year. No duplicates in the object or array.
    if (!years[`${year}`]) {
      years[`${year}`] = [month];
    } else if (!years[`${year}`].includes(month)) {
      years[`${year}`].push(month);
    }
  });

  const selectedTotalExpensesPaid = getTotal(selectedExpensesPaid);

  //PIE GRAPH data
  let pieGraphLabels = selectedExpensesPaid
    .map(exp => exp.category.name)
    .filter(findUnique);
  const pieGraphData = pieGraphLabels.map(label => {
    let sum = 0;

    for (let exp of selectedExpensesPaid) {
      if (exp.category.name === label) {
        sum += parseFloat(exp.amount);
      }
    }

    return sum;
  });

  //BAR GRAPH data
  const barGraphLabels = selectedBudgets.map(bud => bud.category.name);
  const barGraphBudgeted = selectedBudgets.map(bud => bud.amount);
  const barGraphAcutal = barGraphLabels.map(label => {
    let sum = 0;

    for (let exp of selectedExpensesPaid) {
      if (exp.category.name === label) {
        sum += parseFloat(exp.amount);
      }
    }

    return sum;
  });

  //checks if any expenses were paid and not budgeted for and includes it in the bar graph
  const barGraphLabelsCopy = [...barGraphLabels];
  pieGraphLabels.forEach((pieLabel, idx) => {
    if (!barGraphLabelsCopy.includes(pieLabel)) {
      barGraphLabels.push(pieLabel);
      barGraphBudgeted.push(0);
      barGraphAcutal.push(pieGraphData[idx]);
    }
  });

  //HORIZONTAL GRAPH data
  const originalPortfolioPrice = allInvestments.reduce((accu, inv) => {
    return accu + parseFloat(inv.totalShares) * parseFloat(inv.buyPrice);
  }, 0);

  const currentPortfolioPrice = allInvestments.reduce((accu, inv) => {
    return accu + parseFloat(inv.totalShares) * parseFloat(inv.currentPrice);
  }, 0);

  //useEffects
  //creates charts
  useEffect(() => {
    const pie = document.getElementById("pieChart");
    const pieWithData = pieChart(pie);

    const bar = document.getElementById("barGraph");
    const barWithData = barChart(bar);

    const horizontalBar = document.getElementById("horizontalBarGraph");
    const horizontalBarWithData = horizontalBarChart(horizontalBar);

    setPieGraph(pieWithData);
    setBarGraph(barWithData);
    setHorizontalBarGraph(horizontalBarWithData);
  }, []);

  //updates respective charts with data
  useEffect(() => {
    if (pieGraph) {
      pieGraph.data.datasets[0].data = pieGraphData;
      pieGraph.data.labels = pieGraphLabels;

      pieGraph.update();
    }
    if (barGraph) {
      barGraph.data.labels = barGraphLabels;
      barGraph.data.datasets[0].data = barGraphBudgeted;
      barGraph.data.datasets[1].data = barGraphAcutal;

      barGraph.update();
    }
  }, [selectedExpensesPaid]);

  useEffect(() => {
    if (horizontalBarGraph) {
      horizontalBarGraph.data.datasets[0].data[0] = originalPortfolioPrice;
      horizontalBarGraph.data.datasets[0].data[1] = currentPortfolioPrice;

      horizontalBarGraph.update();
    }
  }, [allInvestments]);

  //fetches data
  useEffect(() => {
    dispatch(_getBudgets());
    dispatch(_getInvestments());
    dispatch(_getMonthlyIncomes());
    dispatch(_getExpenses());
    dispatch(setDate());
    dispatch(_getCategories());
  }, []);

  //sets dropdown to current date on initial load
  useEffect(() => {
    setSelectedMonth(currentDate.num);
    setSelectedYear(currentDate.year);
  }, [currentDate]);

  //sets the number of months for the month dropdown
  useEffect(() => {
    if (currentDate.year === selectedYear) {
      setCurrentMonths(Array.from(Array(currentDate.num).keys()));
    } else {
      const idx = (years[selectedYear] ? years[selectedYear][0] : null) || 1;
      setCurrentMonths(Array.from(Array(12).keys()).slice(idx - 1));
    }
  }, [selectedYear]);

  //makes api call to update stocks with current price
  useEffect(() => {
    const prevStocks = window.localStorage.getItem(STOCKS);
    const allStocks = allInvestments.map(inv => inv.tickerSymbol).join("");
    const lastStockUpateDate = allInvestments[0]
      ? new Date(allInvestments[0].updatedAt)
      : new Date(currentDate.full);
    const todayDate = new Date(currentDate.full);

    if (!prevStocks) {
      window.localStorage.setItem(STOCKS, allStocks);
    }

    //will only update stock price once a day, if a stock was added/removed to save on api calls, or if they log in
    if (
      (prevStocks !== allStocks ||
        lastStockUpateDate.toDateString() !== todayDate.toDateString()) &&
      allStocks
    ) {
      window.localStorage.setItem(STOCKS, allStocks);
      try {
        const run = async () => {
          if (allInvestments.length) {
            if (triggerForYahoo) {
              dispatch(getInvestmentsPrice(allInvestments));
            }
          }
        };
        run();
      } catch (error) {
        console.log(error);
      }
    }
  }, [allInvestments]);

  //Event handlers for month & year dropdown
  const handleMonthChange = evt => {
    setSelectedMonth(parseInt(evt.target.value));
  };

  const handleYearChange = evt => {
    const evtYear = parseInt(evt.target.value);

    setSelectedYear(evtYear);

    if (evtYear === currentDate.year) {
      setSelectedMonth(currentDate.num);
    } else {
      setSelectedMonth(years[evtYear][0]);
    }
  };

  if (!pieGraphLabels.length) {
    pieGraphLabels = ["No Expenses Paid This Month"];
  }

  return (
    <div id="content">
      <div className="container-fluid">
        {/* Title and Month/Year dropdown */}

        <div className="d-sm-flex justify-content-between align-items-center mb-4">
          <h3 className="text-dark mb-0 m-3">Dashboard</h3>
        </div>
        <div className="col-md-6 text-nowrap">
          <label htmlFor="DropDownMonth" className="form-label">
            <small>Select Month??</small>

            <select
              className="form-select-sm d-block form-select form-select-sm"
              name="DropDownMonth"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {currentMonths.map((month, idx) => (
                <option key={idx} value={month + 1}>
                  {month + 1}
                </option>
              ))}
            </select>
          </label>
          ????????
          <label htmlFor="DropDownYear" className="form-label">
            <small>Select Year??</small>

            <select
              className="form-select-sm d-block form-select form-select-sm"
              name="DropDownYear"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {Object.entries(years).map(year => (
                <option key={year[1]} value={year[0]}>
                  {year[0]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <hr></hr>
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
                      <span>
                        ${parseFloat(selectedMonthlyIncome.amount).toFixed(2)}
                      </span>
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
                    <div className="text-uppercase text-primary fw-bold text-xs mb-1">
                      <span>
                        Remaining Budget after paid expenses (monthly)
                      </span>
                    </div>
                    <div className="text-dark fw-bold h5 mb-0">
                      <span>
                        {selectedMonthlyIncome.amount -
                          selectedTotalExpensesPaid >=
                        0 ? (
                          <span>
                            $
                            {(
                              selectedMonthlyIncome.amount -
                              selectedTotalExpensesPaid
                            ).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-danger">
                            $
                            {(
                              selectedMonthlyIncome.amount -
                              selectedTotalExpensesPaid
                            ).toFixed(2)}
                          </span>
                        )}
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
                    <div className="text-uppercase text-primary fw-bold text-xs mb-1">
                      <span>Actual expenses paid (Monthly)</span>
                    </div>
                    <div className="text-dark fw-bold h5 mb-0 me-3">
                      <span>${selectedTotalExpensesPaid.toFixed(2)}</span>
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
                    <div className="text-uppercase text-primary fw-bold text-xs mb-1">
                      <span>Portfolio Profit & Loss</span>
                    </div>
                    <div className="text-dark fw-bold h5 mb-0">
                      <span>
                        {currentPortfolioPrice - originalPortfolioPrice >= 0 ? (
                          <span className="text-success">
                            ${" "}
                            {(
                              currentPortfolioPrice - originalPortfolioPrice
                            ).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-danger">
                            ${" "}
                            {(
                              currentPortfolioPrice - originalPortfolioPrice
                            ).toFixed(2)}
                          </span>
                        )}
                      </span>
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
      <hr></hr>

      <div className="row">
        {/* Expense vs Budget Bar Graph */}

        <div className="col-lg-7 col-xl-8">
          <div className="card shadow mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-1">
                Expense (Paid in Month) vs Budget (Monthly)
              </h6>
            </div>
            <div className="card-body">
              <div className="chart-area">
                <canvas id="barGraph"></canvas>
              </div>
              <div className="text-center small mt-4">
                <span className="me-2">
                  <i className="fas fa-circle" style={{ color: `#36b9cc` }}></i>
                  ??Budgeted
                </span>
                <span className="me-2">
                  <i className="fas fa-circle" style={{ color: `#F6C23E` }}></i>
                  ??Actual
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Breakdown Pie Chart */}

        <div className="col-lg-5 col-xl-4">
          <div className="card shadow mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-1">
                Expense by Category (Paid in Month)
              </h6>
            </div>
            <div className="card-body">
              <div className="chart-area">
                <canvas id="pieChart"></canvas>
              </div>
              <div className="text-center small mt-4">
                {pieGraphLabels.map((label, idx) => {
                  return (
                    <span key={idx} className="me-2">
                      <i
                        className="fas fa-circle"
                        style={{ color: `${colors[idx]}` }}
                      ></i>
                      ??{label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {/* Horizontal Bar Graph */}

        <div className="col">
          <div className="card shadow mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-1">
                Investements (Original vs Current Value)
              </h6>
            </div>
            <div className="card-body">
              <div className="chart-area">
                <canvas id="horizontalBarGraph"></canvas>
              </div>
              <div className="text-center small mt-4">
                <span className="me-2">
                  <i className="fas fa-circle" style={{ color: `#b336cc` }}></i>
                  ??Original Value
                </span>
                <span className="me-2">
                  <i className="fas fa-circle" style={{ color: `#cc364a` }}></i>
                  ??Current Value
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
