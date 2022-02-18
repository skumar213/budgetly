import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../store/auth";
import { _createMonthlyIncome } from "../store/monthlyIncomes";
import { Link } from "react-router-dom";

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

  //Logs user into seeded demo
  const handleSeededDemo = () => {
    dispatch(authenticate("mike@gmail.com", "", "login"));
  };

  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-12 col-xl-10">
            <div className="card shadow-lg o-hidden border-0 my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-flex">
                    <div
                      className="flex-grow-1 bg-login-image"
                      style={{
                        backgroundImage:
                          'url("/bootstrap/assets/img/dogs/image3.jpeg")',
                      }}
                    ></div>
                  </div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h4 className="text-dark mb-4">Welcome Back!</h4>
                      </div>
                    </div>
                    <form
                      className="user"
                      style={{ marginRight: "3%" }}
                      onSubmit={handleSubmit}
                    >
                      <div className="mb-3">
                        <label htmlFor="email">
                          <small>Email</small>
                        </label>
                        <input
                          className="form-control form-control-user"
                          aria-describedby="emailHelp"
                          name="email"
                          type="text"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password">
                          <small>Password</small>
                        </label>
                        <input
                          className="form-control form-control-user"
                          name="password"
                          type="password"
                        />
                      </div>
                      <div>
                        <button
                          className="btn btn-primary d-block btn-user w-100"
                          type="submit"
                        >
                          Login
                        </button>
                        <hr></hr>
                      </div>
                      {error && error.response && (
                        <div> {error.response.data} </div>
                      )}
                    </form>
                    <div className="text-center">
                      <Link to="/signup">Create an Account</Link>
                    </div>
                    <div className="text-center">
                      <Link to="" onClick={handleSeededDemo}>
                        View seeded demo without an account
                      </Link>
                    </div>

                    {/* Needed to show full image */}
                    <div className="btn w-100"> </div>
                    <div className="btn w-100"> </div>
                    <div className="btn w-100"> </div>
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
