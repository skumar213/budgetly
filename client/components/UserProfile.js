import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { _updateUser } from "../store/auth";
import history from "../history";
import {
  _getMonthlyIncomes,
  _updateMonthlyIncome,
} from "../store/monthlyIncomes";
import { setDate } from "../store/date";
import { compareDates, sortSingle } from "../helpers";

const UserProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth);
  const monthlyIncomes = useSelector(state => state.monthlyIncomes);
  const currentDate = useSelector(state => state.date);
  const thisMonthIncome = monthlyIncomes.filter(inc =>
    compareDates(inc.createdAt, currentDate.full)
  );
  const years = {};

  const [email, setEmail] = useState(currentUser.email);
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [password, setPassword] = useState("");
  const [incomeId, setIncomeId] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  let allDatesForIncomes = sortSingle(monthlyIncomes, "createdAt").map(inc => {
    const date = new Date(inc.createdAt);
    return {
      id: inc.id,
      date: `${date.getMonth() + 1}/1/${date.getFullYear()}`,
    };
  });

  allDatesForIncomes = allDatesForIncomes.filter(date => {
    const year = new Date(date.date).getFullYear();

    if (!years[`${year}`]) {
      years[`${year}`] = date.id;
    }

    if (year === selectedYear) {
      return true;
    } else {
      return false;
    }
  });

  const legend = {
    email: setEmail,
    firstName: setFirstName,
    lastName: setLastName,
    password: setPassword,
    monthlyIncome: setMonthlyIncome,
  };

  useEffect(() => {
    dispatch(_getMonthlyIncomes());
    dispatch(setDate());
  }, []);

  useEffect(() => {
    if (monthlyIncomes.length) {
      setMonthlyIncome(thisMonthIncome[0].amount);
      setIncomeId(thisMonthIncome[0].id);
      setSelectedYear(currentDate.year);
    }
  }, [monthlyIncomes]);

  //for user info
  const handleChange = evt => {
    const fn = legend[evt.target.name];

    fn(evt.target.value);
  };

  const handleSubmit = evt => {
    evt.preventDefault();

    const lowerCaseEmail = email.toLowerCase();

    const newInfo = password
      ? { email: lowerCaseEmail, firstName, lastName, password }
      : { email: lowerCaseEmail, firstName, lastName };

    dispatch(_updateUser(newInfo));
    history.push("/home");
  };

  //for monthly income
  const handeIncomeChange = evt => {
    const id = parseInt(evt.target.value);
    const amount = parseFloat(
      monthlyIncomes.filter(inc => inc.id === id)[0].amount
    ).toFixed(2);

    setIncomeId(id);
    setMonthlyIncome(amount);
  };

  const handeIncomeYearChange = evt => {
    const evtYear = parseInt(evt.target.value);
    const evtId = years[evt.target.value];
    const todayYear = new Date(thisMonthIncome[0].createdAt).getFullYear();
    const amount = parseFloat(
      monthlyIncomes.filter(inc => inc.id === evtId)[0].amount
    ).toFixed(2);

    setSelectedYear(evtYear);

    if (evtYear === todayYear) {
      setIncomeId(thisMonthIncome[0].id);
      setMonthlyIncome(thisMonthIncome[0].amount);
    } else {
      setIncomeId(evtId);
      setMonthlyIncome(amount);
    }
  };

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
            value={incomeId}
            onChange={handeIncomeChange}
          >
            {allDatesForIncomes.map(date => {
              const month = date.date.split("/")[0];

              return (
                <option key={date.id} value={date.id}>
                  {month}
                </option>
              );
            })}
          </select>

          <label htmlFor="incomeDropDownYear">
            <small>Select Year </small>
          </label>
          <select
            name="incomeDropDownYear"
            value={selectedYear}
            onChange={handeIncomeYearChange}
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
