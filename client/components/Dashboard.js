import React, { useState, useEffect } from "react";
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
  pieChart,
  randomColor,
} from "../helpers";

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
  const allCategories =
    sortSingle(
      useSelector(state => state.categories),
      "name"
    ) || [];

  //local states
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentMonths, setCurrentMonths] = useState([]);
  const [currentInvestmentPrices, setCurrentInvestmentPrices] = useState([]);

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

  const selectedTotalBudget = getTotal(selectedBudgets);
  const selectTotalExpenses = getTotal(
    Object.values(selectedExpensesDueOrPaid)
  );

  const currentPortfolioPrice = currentInvestmentPrices.reduce((accu, inv) => {
    return accu + parseFloat(inv.totalShares) * parseFloat(inv.currentPrice);
  }, 0);

  // console.log(selectedExpensesDue)

  // make an array of colors with categories for pie graph = [category, amount, color]
  const pieGraphData = selectedExpensesPaid.map(exp => {
    const color = randomColor();
    return [exp.category.name, exp.amount, color];
  });
  const uniquePieData = {};
  pieGraphData.forEach((exp, idx) => {
    let totalAmount = parseFloat(exp[1]);

    if (!uniquePieData[exp[0]]) {
      for (let i = idx + 1; i < pieGraphData.length; i++) {
        if (pieGraphData[i][0] === exp[0]) {
          totalAmount += parseFloat(pieGraphData[i][1]);
        }
      }

      uniquePieData[exp[0]] = [exp[0], totalAmount, exp[2]];
    }
  });
  const formattedPieData = Object.values(uniquePieData).length
    ? Object.values(uniquePieData)
    : [["No Expenses Paid This Month", 1, "#3c64cc"]];

  //useEffects to fetch data
  useEffect(() => {
    const pieGraph = document.getElementById("myChart");
    pieChart(pieGraph, formattedPieData);
  }, [selectedExpensesPaid]);


  useEffect(() => {
    dispatch(_getBudgets());
    dispatch(_getInvestments());
    dispatch(_getMonthlyIncomes());
    dispatch(_getExpenses());
    dispatch(setDate());
    dispatch(_getCategories());
  }, []);

  useEffect(() => {
    setSelectedMonth(currentDate.num);
    setSelectedYear(currentDate.year);
  }, [currentDate]);

  useEffect(() => {
    if (currentDate.year === selectedYear) {
      setCurrentMonths(Array.from(Array(currentDate.num).keys()));
    } else {
      const idx = years[selectedYear] || 1;
      setCurrentMonths(Array.from(Array(12).keys()).slice(idx - 1));
    }
  }, [selectedYear]);

  //Need to comment out during development to avoid going over daily api call amount
  // useEffect(() => {
  //   try {
  //     const run = async () => {
  //       if (allInvestments.length) {
  //         const prices = (await getInvestmentsPrice(allInvestments)) || [];

  //         setCurrentInvestmentPrices(prices);
  //       }
  //     };
  //     run();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [allInvestments]);

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

  return (
    <div className="content">
      <div id="container-fluid">
        <div className="container-fluid">
          <div className="d-sm-flex justify-content-between align-items-center mb-4">
            <h3 className="text-dark mb-0">Dashboard</h3>
          </div>
          <div>
            <label htmlFor="DropDownMonth">
              <small>Select Month </small>
            </label>
            <select
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

            <label htmlFor="DropDownYear">
              <small>Select Year </small>
            </label>
            <select
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
                        <span>${selectedMonthlyIncome.amount}</span>
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
                          {selectedMonthlyIncome.amount - selectedTotalBudget >=
                          0 ? (
                            <span>
                              $
                              {(
                                selectedMonthlyIncome.amount -
                                selectedTotalBudget
                              ).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-danger">
                              $
                              {(
                                selectedMonthlyIncome.amount -
                                selectedTotalBudget
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
                      <div className="text-uppercase text-info fw-bold text-xs mb-1">
                        <span>Expected Expenses (due or paid in month)</span>
                      </div>
                      <div className="text-dark fw-bold h5 mb-0 me-3">
                        <span>${selectTotalExpenses.toFixed(2)}</span>
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
                        <span>
                          Total Portfolio Value
                          <strong style={{ fontSize: "15px" }}>*</strong>
                        </span>
                      </div>
                      <div className="text-dark fw-bold h5 mb-0">
                        <span>${currentPortfolioPrice.toFixed(2)}</span>
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
        <div style={{ fontSize: "10px", textAlign: "center" }}>
          * portfolio will show up as $0.00 if daily API calls are exceeded
        </div>
        <hr></hr>

        <div className="row">
          <div className="col-lg-5 col-xl-4">
            <div className="card shadow mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="text-primary fw-bold m-0">
                  Expense by Category (Paid in Month)
                </h6>
                <div className="dropdown no-arrow">
                  <button
                    className="btn btn-link btn-sm dropdown-toggle"
                    aria-expanded="false"
                    data-bs-toggle="dropdown"
                    type="button"
                  >
                    <i className="fas fa-ellipsis-v text-gray-400"></i>
                  </button>
                  <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                    <p className="text-center dropdown-header">
                      dropdown header:
                    </p>
                    <a className="dropdown-item" href="#">
                       Action
                    </a>
                    <a className="dropdown-item" href="#">
                       Another action
                    </a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#">
                       Something else here
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="chart-area">
                  <canvas
                    id="myChart"
                    height="320"
                    style={{
                      display: "block",
                      width: "249px",
                      height: "320px",
                    }}
                    width="249"
                  ></canvas>
                </div>
                <div className="text-center small mt-4">
                  {formattedPieData.map((exp, idx) => {
                    return (
                      <span key={idx} className="me-2">
                        <i
                          className="fas fa-circle"
                          style={{ color: `${exp[2]}` }}
                        ></i>
                         {exp[0]}
                      </span>
                    );
                  })}
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
