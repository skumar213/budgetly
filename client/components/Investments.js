import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  _getInvestments,
  _updateInvestment,
  _createInvestment,
  _deleteInvestment,
} from "../store/investments";
import { sortSingle } from "../helpers";
import { clearError } from "../store/errorHandler";

const Investments = () => {
  const dispatch = useDispatch();

  //redux states
  const allInvestments = sortSingle(
    useSelector(state => state.investments),
    "tickerSymbol"
  );
  const error = useSelector(state => state.errorHandler);

  //local states
  const [currentId, setCurrentId] = useState("");
  const [tickerSymbol, setTickerSymbol] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [totalShares, setTotalShares] = useState("");
  const [isCreate, setIsCreate] = useState("");

  //useEffect to fetch data
  useEffect(() => {
    dispatch(_getInvestments());
  }, []);

  //legend to help call the setstate functions
  const legend = {
    currentId: setCurrentId,
    tickerSymbol: setTickerSymbol,
    buyPrice: setBuyPrice,
    totalShares: setTotalShares,
    isCreate: setIsCreate,
  };

  //clear state helper
  const clearState = () => {
    for (let key in legend) {
      legend[key]("");
    }
  };

  //event handler for changing all forms
  const handleChange = evt => {
    const fn = legend[evt.target.name];

    fn(evt.target.value);
  };

  //event handler for cancelling form edit
  const handleCancel = evt => {
    evt.preventDefault();

    clearState();
  };

  //UPDATE event handlers
  const handleEdit = inv => evt => {
    evt.preventDefault();
    dispatch(clearError());

    setCurrentId(Number(inv.id));
    setTickerSymbol(inv.tickerSymbol);
    setBuyPrice(inv.buyPrice);
    setTotalShares(inv.totalShares);
  };

  const handleUpdateSubmit = async evt => {
    evt.preventDefault();

    const invToUpdate = {
      id: currentId,
      tickerSymbol,
      buyPrice,
      totalShares,
    };

    dispatch(_updateInvestment(invToUpdate));

    clearState();
  };

  //DELETE event handler
  const handleDelete = inv => evt => {
    evt.preventDefault();

    dispatch(clearError());
    dispatch(_deleteInvestment(inv));
  };

  //CREATE Event handler
  const handleCreateSubmit = evt => {
    evt.preventDefault();

    const newInv = {
      tickerSymbol,
      buyPrice,
      totalShares,
    };

    dispatch(_createInvestment(newInv));

    clearState();
  };

  const handleCreate = evt => {
    evt.preventDefault();

    dispatch(clearError());
    setIsCreate(true);
  };

  return (
    <div>
      <div id="content">
        <div className="container-fluid">
          <h3 className="text-dark mb-4 m-3">Investments</h3>
          <div className="card shadow">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 text-nowrap">
                  {!currentId && !isCreate ? (
                    <button
                      className="btn btn-primary py-0"
                      onClick={handleCreate}
                    >
                      Add New Investment
                    </button>
                  ) : null}
                </div>
              </div>
              <div
                id="dataTable"
                className="table-responsive table mt-2"
                role="grid"
                aria-describedby="dataTable_info"
              >
                <form
                  onSubmit={isCreate ? handleCreateSubmit : handleUpdateSubmit}
                >
                  <table id="dataTable" className="table my-0">
                    <thead>
                      <tr>
                        <th>Ticker Symbol</th>
                        <th>Buy Price</th>
                        <th>Total Shares</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {error.error ? (
                        <tr>
                          <td className="text-danger">
                            <strong>{error.error}</strong>
                          </td>
                        </tr>
                      ) : null}
                      {isCreate ? (
                        <tr>
                          <td>
                            <label htmlFor="tickerSymbol">
                              <small>Ticker Symbol</small>
                            </label>
                            <input
                              name="tickerSymbol"
                              type="text"
                              value={tickerSymbol}
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            <label htmlFor="buyPrice">
                              <small>Buy Price</small>
                            </label>
                            <input
                              name="buyPrice"
                              type="number"
                              value={buyPrice}
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            <label htmlFor="totalShares">
                              <small>Total Shares</small>
                            </label>
                            <input
                              name="totalShares"
                              type="number"
                              value={totalShares}
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            <button
                              type="submit"
                              className="btn btn-success py-0"
                            >
                              Add Investment
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={handleCancel}
                              className="btn btn-primary py-0"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ) : null}

                      {allInvestments.map(inv => {
                        if (currentId !== inv.id) {
                          return (
                            <tr key={inv.id}>
                              <td>
                                <input
                                  className="border-0"
                                  name="tickerSymbol"
                                  type="text"
                                  value={inv.tickerSymbol}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="border-0"
                                  name="buyPrice"
                                  type="number"
                                  value={inv.buyPrice}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="border-0"
                                  name="totalShares"
                                  type="number"
                                  value={inv.totalShares}
                                  readOnly
                                />
                              </td>
                              <td>
                                {!currentId && !isCreate ? (
                                  <button
                                    onClick={handleEdit(inv)}
                                    className="btn btn-success py-0"
                                  >
                                    Edit
                                  </button>
                                ) : null}
                              </td>
                              <td>
                                {!currentId && !isCreate ? (
                                  <button
                                    onClick={handleDelete(inv)}
                                    className="btn btn-danger py-0"
                                  >
                                    Delete
                                  </button>
                                ) : null}
                              </td>
                            </tr>
                          );
                        } else {
                          return (
                            <tr key={inv.id}>
                              <td>
                                <label htmlFor="tickerSymbol">
                                  <small>Ticker Symbol</small>
                                </label>
                                <input
                                  name="tickerSymbol"
                                  type="text"
                                  value={tickerSymbol}
                                  onChange={handleChange}
                                />
                              </td>
                              <td>
                                <label htmlFor="buyPrice">
                                  <small>Buy Price</small>
                                </label>
                                <input
                                  name="buyPrice"
                                  type="number"
                                  value={buyPrice}
                                  onChange={handleChange}
                                />
                              </td>
                              <td>
                                <label htmlFor="totalShares">
                                  <small>Total Shares</small>
                                </label>
                                <input
                                  name="totalShares"
                                  type="number"
                                  value={totalShares}
                                  onChange={handleChange}
                                />
                              </td>
                              <td>
                                <button
                                  type="submit"
                                  className="btn btn-success py-0"
                                >
                                  Update
                                </button>
                              </td>
                              <td>
                                <button
                                  onClick={handleCancel}
                                  className="btn btn-primary py-0"
                                >
                                  Cancel
                                </button>
                              </td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investments;
