import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GlobalStyle } from 'components/common';
import { loansFetchData } from 'redux/actions/loans';
import { web3 } from 'utils/getWeb3';
import { Pair0Contract, Pair1Contract, PriceOracleAddress } from 'config/constants';

// Routes
import Earn from 'components/pages/Earn';
import Borrow from 'components/pages/Borrow';
import Trade from 'components/pages/Trade';
import NotFound from 'components/pages/NotFound';
import NetworkDetector from './common/NetworkDetector';
import Privacy from './pages/Privacy';
import TermsAndConditions from './pages/Terms&Conditions';
import '../App.css';

const App = ({ loansFetchData, loans: { skip, limit, filter } }) => {
  useEffect(() => {
    const timeout = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const pair0 = web3.eth
      .subscribe('logs', {
        address: Pair0Contract
      })
      .on('data', async () => {
        await timeout(3000);
        await loansFetchData({
          skip,
          limit,
          filter: {
            type: filter
          }
        });
      });

    const pair1 = web3.eth
      .subscribe('logs', {
        address: Pair1Contract
      })
      .on('data', async () => {
        await timeout(3000);
        await loansFetchData({
          skip,
          limit,
          filter: {
            type: filter
          }
        });
      });

    const priceOracle = web3.eth
      .subscribe('logs', {
        address: PriceOracleAddress
      })
      .on('data', async () => {
        await timeout(3000);
        await loansFetchData({
          skip,
          limit,
          filter: {
            type: filter
          }
        });
      });

    return () => {
      pair0.unsubscribe((error, success) => {
        if (error) console.log(error);
        if (success) console.log('Successfully unsubscribed!');
      });
      pair1.unsubscribe((error, success) => {
        if (error) console.log(error);
        if (success) console.log('Successfully unsubscribed!');
      });     
      priceOracle.unsubscribe((error, success) => {
        if (error) console.log(error);
        if (success) console.log('Successfully unsubscribed!');
      });
    };
  }, [loansFetchData, skip, limit, filter]);

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

App.propTypes = {
  loansFetchData: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  loans: state.loans
});

export default connect(mapStateToProps, {
  loansFetchData
})(NetworkDetector(App));
