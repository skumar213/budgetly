import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import { Login, Signup } from './components/AuthForm';
import Dashboard from './components/Dashboard';
import {me} from './store'
import UserProfile from './components/UserProfile';
import Expenses from './components/Expenses'
import Budgets from './components/Budgets';
import Investments from './components/Investments';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }


  render() {
    const {isLoggedIn} = this.props

    return (
      <div id="content-wrapper" className="d-flex flex-column">
        {isLoggedIn ? (
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path='/user' component={UserProfile}/>
            <Route path='/expenses' component={Expenses}/>
            <Route path='/budgets' component={Budgets}/>
            <Route path='/investments' component={Investments}/>
            <Redirect to="/dashboard" />
          </Switch>
        ) : (
          <Switch>
            <Route path='/' exact component={ Login } />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
