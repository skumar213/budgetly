import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout, authenticate } from "../store";

const Navbar = () => {
  const dispatch = useDispatch();

  //redux states
  const isLoggedIn = useSelector(state => !!state.auth.id);

  //Logout event handler
  const handleClick = () => {
    dispatch(logout());
  };

  //Logs user into seeded demo
  const handleSeededDemo = () => {
    dispatch(authenticate("mike@gmail.com", "", "login"));
  };

  return (
    <nav className="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0">
      <div className="container-fluid d-flex flex-column p-0">
        <a
          className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
          href="/"
        >
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-bold"></i>
          </div>
          <div className="sidebar-brand-text mx-3">
            <span>Budgetly</span>
          </div>
        </a>
        <hr className="sidebar-divider my-0" />

        {isLoggedIn ? (
          <ul className="navbar-nav text-light">
            <li className="nav-item">
              <Link className="nav-link active" to="/home">
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/user">
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/expenses">
                <i className="fas fa-table"></i>
                <span>Expenses</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/budgets">
                <i className="fas fa-align-right"></i>
                <span>Budgets</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/investments">
                <i className="fas fa-area-chart"></i>
                <span>Investments</span>
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="#" onClick={handleClick}>
                <i className="fas fa-user-circle"></i>
                <span>Logout</span>
              </a>
            </li>
          </ul>
        ) : (
          <ul className="navbar-nav text-light">
            <li className="nav-item">
              <Link className="nav-link active" to="/login">
                <i className="fas fa-user"></i>
                <span>Login</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/signup">
                <i className="fas fa-user-circle"></i>
                <span>Signup</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to=""
                className="nav-link active"
                onClick={handleSeededDemo}
              >
                <i className="fa fa-star"></i>
                <span>View Seeded Demo</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
