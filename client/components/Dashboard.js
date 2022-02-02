import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { _getBudgets } from "../store/budgets";
import { _getInvestments } from "../store/investments";

const Dashboard = () => {
  const dispatch = useDispatch();
  const monthlyIncome = parseFloat(useSelector(state => state.auth.monthlyIncome));
  const totalBudget = useSelector(state => state.budgets).reduce((accu, bud) => accu + parseFloat(bud.amount), 0)

  useEffect(() => {
    dispatch(_getBudgets())
    dispatch(_getInvestments())
  },[])

  console.log(totalBudget)


  return (
    <div id="container-fluid">
      <div className="container-fluid">
        <div className="d-sm-flex justify-content-between align-items-center mb-4">
          <h3 className="text-dark mb-0">Dashboard</h3>
        </div>
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
                      <span>$40,000</span>
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
                      <span>$215,000</span>
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
                      <span>Expected Expenses (monthly)</span>
                    </div>
                    <div className="text-dark fw-bold h5 mb-0 me-3">
                      <span>$40,000</span>
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
                      <span>Total Portfolio Value</span>
                    </div>
                    <div className="text-dark fw-bold h5 mb-0">
                      <span>$40,000</span>
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
    </div>
  );
};

export default Dashboard;

