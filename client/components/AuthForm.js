import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../store/auth";
import { _createMonthlyIncome } from "../store/monthlyIncomes";

export const Login = () => {
  const dispatch = useDispatch();

  //redux state
  const error = useSelector(state => state.auth.error);

  //log in event handler
  const handleSubmit = evt => {
    evt.preventDefault();
    const email = evt.target.email.value.toLowerCase();
    const password = evt.target.password.value;
    dispatch(authenticate(email, password, "login"));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="text" />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
    </div>
  );
};

export const Signup = () => {
  const dispatch = useDispatch();

  //redux state
  const error = useSelector(state => state.auth.error);

  //sign up event handler
  const handleSubmit = evt => {
    evt.preventDefault();
    const firstName = evt.target.firstName.value;
    const lastName = evt.target.lastName.value;
    const email = evt.target.email.value.toLowerCase();
    const password = evt.target.password.value;
    const monthlyIncome = parseFloat(evt.target.monthlyIncome.value);

    dispatch(
      authenticate(
        email,
        password,
        "signup",
        firstName,
        lastName,
        monthlyIncome
      )
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">
            <small>First Name</small>
          </label>
          <input name="firstName" type="text" />
        </div>
        <div>
          <label htmlFor="lastName">
            <small>Last Name</small>
          </label>
          <input name="lastName" type="text" />
        </div>
        <div>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="text" />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </div>
        <div>
          <label htmlFor="monthlyIncome">
            <small>Monthly Income</small>
          </label>
          <input name="monthlyIncome" type="number" />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
    </div>
  );
};
