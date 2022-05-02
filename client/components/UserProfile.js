import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { _updateUser } from "../store/auth";
import {
  _getMonthlyIncomes,
  _updateMonthlyIncome,
} from "../store/monthlyIncomes";
import { setDate } from "../store/date";
import { dateFilter } from "../helpers";

const UserProfile = () => {
  const dispatch = useDispatch();
  const years = {};

  //redux states
  const currentUser = useSelector(state => state.auth);
  const currentDate = useSelector(state => state.date);
  const allMonthlyIncomes = useSelector(state => state.monthlyIncomes);

  //local states
  const [email, setEmail] = useState(currentUser.email);
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [password, setPassword] = useState("");
  const [incomeId, setIncomeId] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentMonths, setCurrentMonths] = useState([]);

  //data from redux state organized as needed for page
  const selectedMonthlyIncome = dateFilter(
    allMonthlyIncomes,
    selectedMonth,
    selectedYear,
    currentDate,
    "createdAt"
  )[0] || { amount: 0 };

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

  //useEffects to fetch data and set the income/month/year
  useEffect(() => {
    dispatch(_getMonthlyIncomes());
    dispatch(setDate());
  }, []);

  useEffect(() => {
    setMonthlyIncome(selectedMonthlyIncome.amount);
    setIncomeId(selectedMonthlyIncome.id);
  }, [selectedMonthlyIncome]);

  useEffect(() => {
    setSelectedMonth(currentDate.num);
    setSelectedYear(currentDate.year);
  }, [currentDate]);

  useEffect(() => {
    if (currentDate.year === selectedYear) {
      setCurrentMonths(Array.from(Array(currentDate.num).keys()));
    } else {
      const idx = (years[selectedYear] ? years[selectedYear][0] : null) || 1;
      setCurrentMonths(Array.from(Array(12).keys()).slice(idx - 1));
    }
  }, [selectedYear]);

  useEffect(() => {
    setIncomeId(selectedMonthlyIncome.id);
  }, [selectedMonth]);

  //legend to help call the setstate functions
  const legend = {
    email: setEmail,
    firstName: setFirstName,
    lastName: setLastName,
    password: setPassword,
    monthlyIncome: setMonthlyIncome,
  };

  //event handler for changing user info form
  const handleChange = evt => {
    const fn = legend[evt.target.name];

    fn(evt.target.value);
  };

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

  //UPDATE user info event handlers
  const handleSubmit = evt => {
    evt.preventDefault();

    const lowerCaseEmail = email.toLowerCase();

    const newInfo = password
      ? { email: lowerCaseEmail, firstName, lastName, password }
      : { email: lowerCaseEmail, firstName, lastName };

    dispatch(_updateUser(newInfo));
  };

  //UPDATE monthly income event handler
  const handleIncomeSubmit = evt => {
    evt.preventDefault();

    const incToUpdate = {
      id: incomeId,
      amount: monthlyIncome,
    };

    dispatch(_updateMonthlyIncome(incToUpdate));
  };

  return (
    <div id="content">
      <div className="container-fluid">
        <h3 className="text-dark mb-4 m-3">Profile</h3>

        <div className="row mb-3">
          <div className="row">
            <div className="col">
              <div className="card shadow mb-3">
                <div className="card-header py-3">
                  <p className="text-primary m-0 fw-bold">User Settings</p>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label htmlFor="firstName" className="form-label">
                            <strong>First Name</strong>
                          </label>
                          <input
                            className="form-control"
                            name="firstName"
                            type="text"
                            value={firstName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label htmlFor="lastName" className="form-label">
                            <strong>Last Name</strong>
                          </label>
                          <input
                            className="form-control"
                            name="lastName"
                            type="text"
                            value={lastName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">
                            <strong>Email</strong>
                          </label>
                          <input
                            className="form-control"
                            name="email"
                            type="text"
                            value={email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col">
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            <strong>Password</strong>
                          </label>
                          <input
                            className="form-control"
                            name="password"
                            type="password"
                            value={password}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <button className="btn btn-primary btn-sm" type="submit">
                        Save Settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card shadow">
                <div className="card-header py-3">
                  <p className="text-primary m-0 fw-bold">Monthly Income</p>
                </div>

                <div className="card-body">
                  <form onSubmit={handleIncomeSubmit}>
                    <div className="row">
                      <div className="col-md-6 text-nowrap">
                        <label
                          htmlFor="incomeDropDownMonth"
                          className="form-label"
                        >
                          <small>Select Month </small>
                          <select
                            className="form-select-sm d-block form-select form-select-sm"
                            name="incomeDropDownMonth"
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
                            
                        <label
                          htmlFor="incomeDropDownYear"
                          className="form-label"
                        >
                          <small>Select Year </small>
                          <select
                            className="form-select-sm d-block form-select form-select-sm"
                            name="incomeDropDownYear"
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
                    </div>
                    <br></br>
                    <div className="mb-3">
                      <label htmlFor="monthlyIncome" className="form-label">
                        <strong>Monthly Income ($)</strong>
                      </label>
                      <input
                        className="form-control"
                        name="monthlyIncome"
                        type="number"
                        value={monthlyIncome}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <button className="btn btn-primary btn-sm" type="submit">
                        Update Income
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
