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
      const idx = years[selectedYear] || 1;
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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">
            <small>First Name</small>
          </label>
          <input
            name="firstName"
            type="text"
            value={firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">
            <small>Last Name</small>
          </label>
          <input
            name="lastName"
            type="text"
            value={lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input
            name="email"
            type="text"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Update Profile</button>
        </div>
      </form>
      <form onSubmit={handleIncomeSubmit}>
        <div>
          <label htmlFor="incomeDropDownMonth">
            <small>Select Month </small>
          </label>

          <select
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

          <label htmlFor="incomeDropDownYear">
            <small>Select Year </small>
          </label>
          <select
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

          <div>
            <label htmlFor="monthlyIncome">
              <small>Monthly Income $</small>
            </label>
            <input
              name="monthlyIncome"
              type="number"
              value={monthlyIncome}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <button type="submit">Update Income</button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
