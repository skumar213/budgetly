import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { _updateUser } from "../store";

const UserProfile = () => {
  const user = useSelector(state => state.auth);
  const [email, setEmail] = useState(currentUser.email);
  const [firstName, setFirstName] = useState(currentUser.firstname);
  const [lastName, setLastName] = useState(currentUser.lastname);
  const [password, setPassword] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState(currentUser.lastname);

  const handleSubmit = evt => {
    evt.preventDefault();
    const email = evt.target.email.value.toLowerCase();
    const password = evt.target.password.value;
    dispatch(authenticate(email, password, "login"));
  };

  console.log(user)

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
      </form>
    </div>
  );
};

export default UserProfile;
