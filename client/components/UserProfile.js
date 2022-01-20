import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { _updateUser } from "../store";
import history from "../history";

const UserProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth);

  const [email, setEmail] = useState(currentUser.email);
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [password, setPassword] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState(currentUser.monthlyIncome);

  const legend = {
    email: setEmail,
    firstName: setFirstName,
    lastName: setLastName,
    password: setPassword,
    monthlyIncome: setMonthlyIncome,
  };

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
    history.push('/home')
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
            <small>Monthly Income</small>
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