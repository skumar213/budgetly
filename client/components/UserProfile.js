import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { _updateUser } from "../store/auth";
import history from "../history";
import { _getMonthlyIncomes } from "../store/monthlyIncomes";
import { setDate } from "../store/date";
import { compareDates } from "../helpers";

const UserProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth);
  const monthlyIncomes = useSelector(state => state.monthlyIncomes);
  const currentDate = useSelector(state => state.date);
  const thisMonthIncome = monthlyIncomes.filter(inc =>
    compareDates(inc.createdAt, currentDate.full)
  );

  const [email, setEmail] = useState(currentUser.email);
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [password, setPassword] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");

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
    }
  }, [monthlyIncomes]);

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
        <div>
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
