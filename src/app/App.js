import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import TagManager from 'react-gtm-module';
import PropTypes from 'prop-types';
import { GlobalStyle } from 'app/components';
import { ThemeProvider } from 'styled-components';
import Banner from 'app/components/Banner/Banner';
import ErrorModal from 'app/components/Modals/Error';

import { setTokenBalances, checkTrancheAllowances, checkStakingAllowances, checkSIRRewards } from 'redux/actions/ethereum';
import { fetchExchangeRates } from 'redux/actions/tableData';
import { ETHContracts, MaticContracts, FantomContracts, AvalancheContracts } from 'services/web3Subscriptions';
import {
  networkId,
  maticNetworkId,
  fantomNetworkId,
  avalancheNetworkId,
  JCompoundAddress,
  JAaveAddress,
  JYearnAddress,
  JAvalancheAddress,
  ModeThemes,
  GTMID
} from 'config/constants';
// Routes
import Earn from 'app/pages/Lend';
import Borrow from 'app/pages/Borrow';
import Trade from 'app/pages/Earn';
import Stake from 'app/pages/Stake';

import NotFound from 'app/pages/NotFound';
import NetworkDetector from './components/NetworkDetector';
import NotificationProvider from './components/Notifications/NotificationProvider';
import Privacy from './pages/Privacy';
import TermsAndConditions from './pages/Terms&Conditions';
import '../App.css';

const tagManagerArgs = {
  gtmId: GTMID
}
TagManager.initialize(tagManagerArgs)

const baseRouteUrl = '/:locale(zh|kr|en)?';
const App = ({ setTokenBalances, checkTrancheAllowances, checkStakingAllowances, checkSIRRewards, fetchExchangeRates, path, ethereum: { address, network }, checkServerStatus, theme }) => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    fetchExchangeRates()
  }, [fetchExchangeRates]);

  useEffect(() => {
    if (address) {
      setTokenBalances(address);
      if (network === networkId) {
        checkTrancheAllowances(address, JCompoundAddress);
        checkStakingAllowances(address);
        checkSIRRewards();
      }
      else if (network === maticNetworkId) checkTrancheAllowances(address, JAaveAddress);
      else if (network === fantomNetworkId) checkTrancheAllowances(address, JYearnAddress);
      else if (network === avalancheNetworkId) checkTrancheAllowances(address, JAvalancheAddress);
    }
  }, [address, network, setTokenBalances, checkTrancheAllowances, checkStakingAllowances, checkSIRRewards]);

  useEffect(() => {
    if (network === networkId) {
      ETHContracts.subscribe();
      MaticContracts.unsubscribe();
      FantomContracts.unsubscribe();
      AvalancheContracts.unsubscribe();
    }
    else if (network === maticNetworkId) {
      MaticContracts.subscribe();
      ETHContracts.unsubscribe();
      FantomContracts.unsubscribe();
      AvalancheContracts.unsubscribe();
    }
    else if (network === fantomNetworkId) {
      FantomContracts.subscribe();
      ETHContracts.unsubscribe();
      MaticContracts.unsubscribe();
      AvalancheContracts.unsubscribe();
    }
    else if (network === avalancheNetworkId) {
      AvalancheContracts.subscribe();
      FantomContracts.unsubscribe();
      ETHContracts.unsubscribe();
      MaticContracts.unsubscribe();
      
    }
  }, [network, address, path]);

console.log(process.env.NODE_ENV)
  const serverError = () => {
    return <ErrorModal openModal={showModal} closeModal={() => setShowModal(false)} />;
  };
  const initApp = () => {
    return (
      <ThemeProvider theme={ModeThemes[theme]}>
        <GlobalStyle />
          {
            process.env.NODE_ENV === 'development' &&
            <Banner />
          }
        <NotificationProvider />
        <Router>
          <Switch location={window.location}>
            <Redirect exact from={baseRouteUrl + '/'} to='/tranche' />
            <Route exact path={baseRouteUrl + '/lend'} component={Earn} />
            <Route exact path={baseRouteUrl + '/borrow'} component={Borrow} />
            <Route exact path={baseRouteUrl + '/tranche'} component={Trade} />
            <Route exact path={baseRouteUrl + '/stake'} component={Stake} />
            <Route exact path={baseRouteUrl + '/privacy'} component={Privacy} />
            <Route exact path={baseRouteUrl + '/terms'} component={TermsAndConditions} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </ThemeProvider>
    );
  };
  return checkServerStatus ? initApp() : serverError();
};

App.propTypes = {
  ethereum: PropTypes.object.isRequired,
  setTokenBalances: PropTypes.func.isRequired,
  checkTrancheAllowances: PropTypes.func.isRequired,
  checkStakingAllowances: PropTypes.func.isRequired,
  checkSIRRewards: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  data: state.data,
  path: state.path,
  checkServerStatus: state.checkServerStatus,
  theme: state.theme
});

export default connect(mapStateToProps, {
  setTokenBalances,
  checkTrancheAllowances,
  checkStakingAllowances,
  fetchExchangeRates,
  checkSIRRewards
})(NetworkDetector(App));
