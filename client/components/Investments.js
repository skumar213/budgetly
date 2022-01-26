import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import history from "../history";
import {
  _getInvestments,
  _updateInvestment,
  _createInvestment,
  _deleteInvestment,
} from "../store/investments";
import { sortSingle } from "../helpers";

const Investments = () => {
  const dispatch = useDispatch();
  const allInvestments = useSelector(state => state.investments);

  useEffect(() => {
    dispatch(_getInvestments());
  }, []);

  //all states
  const [currentId, setCurrentId] = useState("");
  const [tickerSymbol, setTickerSymbol] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [isCreate, setIsCreate] = useState("");

  //legend to help call the setstate functions
  const legend = {
    currentId: setCurrentId,
    tickerSymbol: setTickerSymbol,
    buyPrice: setBuyPrice,
    isCreate: setIsCreate,
  };

  //clear state helper
  const clearState = () => {
    for (let key in legend) {
      legend[key]("");
    }
  };

  //event handler for changing any form
  const handleChange = evt => {
    const fn = legend[evt.target.name];

    fn(evt.target.value);
  };

  //event handler for cancelling form edit
  const handleCancel = evt => {
    evt.preventDefault();

    clearState();
  };

  //event handlers for UPDATE
  const handleEdit = inv => evt => {
    inv.preventDefault();

    setCurrentId(Number(inv.id));
    setTickerSymbol(inv.tickerSymbol);
    setBuyPrice(inv.buyPrice);
  };

  const handleUpdateSubmit = evt => {
    evt.preventDefault();

    const invToUpdate = {
      id: currentId,
      tickerSymbol,
      buyPrice,
    };

    dispatch(_updateInvestment(invToUpdate));

    clearState();
  };

  //event handler for DELETE
  const handleDelete = inv => evt => {
    evt.preventDefault();

    dispatch(_deleteInvestment(inv));
  };

  //Event handler for CREATE
  const handleCreateSubmit = evt => {
    evt.preventDefault();

    const newInv = {
      tickerSymbol,
      buyPrice,
    };

    dispatch(_createInvestment(newInv));

    clearState();
  };

  const handleCreate = evt => {
    evt.preventDefault();

    setIsCreate(true);
  };

  return (
    <div>
      <>
        {!currentId && !isCreate ? (
          <div>
            <div>
              <button onClick={handleCreate}>Add New Investment</button>
            </div>
            <hr></hr>
          </div>
        ) : null}
      </>

      <>
        {isCreate ? (
          <div>
            <form onSubmit={handleCreateSubmit}>
              <div>
                <label htmlFor="tickerSymbol">
                  <small>Ticker Symbol</small>
                </label>
                <input
                  name="tickerSymbol"
                  type="text"
                  value={tickerSymbol}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="buyPrice">
                  <small>Buy Price</small>
                </label>
                <input
                  name="buyPrice"
                  type="number"
                  value={buyPrice}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="totalShares">
                  <small>Total Shares</small>
                </label>
                <input
                  name="totalShares"
                  type="number"
                  value={amount}
                  onChange={handleChange}
                />
              </div>
              <div>
                <button type="submit">Add Investment</button>
              </div>
              <div>
                <button onClick={handleCancel}>Cancel</button>
              </div>
              <hr></hr>
            </form>
          </div>
        ) : null}
      </>

      {allInvestments.map(inv => {
        if (currentId !== inv.id) {
          return (
            <div key={inv.id}>
              <form>
                <div>
                  <label htmlFor="tickerSymbol">
                    <small>Ticker Symbol</small>
                  </label>
                  <input
                    name="tickerSymbol"
                    type="text"
                    value={inv.tickerSymbol}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="buyPrice">
                    <small>Buy Price</small>
                  </label>
                  <input
                    name="buyPrice"
                    type="number"
                    value={inv.buyPrice}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="totalShares">
                    <small>Total Shares</small>
                  </label>
                  <input
                    name="totalShares"
                    type="number"
                    value={inv.totalShares}
                    readOnly
                  />
                </div>
                <div>
                  {!currentId && !isCreate ? (
                    <button onClick={handleEdit(inv)}>Select to Edit</button>
                  ) : null}
                </div>
                <div>
                  {!currentId && !isCreate ? (
                    <button onClick={handleDelete(inv)}>Delete</button>
                  ) : null}
                </div>
              </form>
            </div>
          );
        } else {
          return (
            <div key={inv.id}>
              <form onSubmit={handleUpdateSubmit}>
                <div>
                  <label htmlFor="tickerSymbol">
                    <small>Ticker Symbol</small>
                  </label>
                  <input
                    name="tickerSymbol"
                    type="text"
                    value={tickerSymbol}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="buyPrice">
                    <small>Buy Price</small>
                  </label>
                  <input
                    name="buyPrice"
                    type="number"
                    value={buyPrice}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="totalShares">
                    <small>Total Shares</small>
                  </label>
                  <input
                    name="totalShares"
                    type="number"
                    value={totalShares}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <button type="submit">Update</button>
                </div>
                <div>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Investments;
