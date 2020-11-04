import React, {useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { GlobalStyle } from 'components/common';
import { wsWeb3 } from 'utils/getWeb3';
import { Pair0Contract, Pair1Contract } from 'config/constants';

// Routes
import Earn from 'components/pages/Earn';
import Borrow from 'components/pages/Borrow';
import Trade from 'components/pages/Trade';
import NotFound from 'components/pages/NotFound';
import NetworkDetector from './common/NetworkDetector';
import Privacy from './pages/Privacy';
import TermsAndConditions from './pages/Terms&Conditions';
import '../App.css';

const App = () => {
  // useEffect(() => {
    
  // }, [])

  return (
    <>
      <GlobalStyle />
      <Router>
        <Switch>
          <Redirect exact from='/' to='/borrow' />
          <Route exact path='/earn' component={Earn} />
          <Route exact path='/borrow' component={Borrow} />
          <Route exact path='/trade' component={Trade}>
            <Redirect to='/borrow' />
          </Route>
          <Route exact path='/privacy' component={Privacy} />
          <Route exact path='/terms' component={TermsAndConditions} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </>
  );
};

export default NetworkDetector(App);
