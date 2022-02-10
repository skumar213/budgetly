import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";

const Navbar = () => {
  const dispatch = useDispatch();

  //redux states
  const isLoggedIn = useSelector(state => !!state.auth.id);

  //Logout event handler
  const handleClick = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0">
      {isLoggedIn ? (
        <div className="container-fluid d-flex flex-column p-0">
          <a
            className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
            href="#"
          >
            <div className="sidebar-brand-icon rotate-n-15">
              <i className="fas fa-laugh-wink"></i>
            </div>
            <div className="sidebar-brand-text mx-3">
              <span>Budgetly</span>
            </div>
          </a>
          <hr className="sidebar-divider my-0" />

          <ul id="accordionSidebar" className="navbar-nav text-light">
            {/* The navbar will show these links after you log in */}
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
        </div>
      ) : (
        <div className="container">
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
