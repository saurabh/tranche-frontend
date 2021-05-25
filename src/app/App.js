import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GlobalStyle } from 'app/components';
import { ThemeProvider } from 'styled-components';
import Banner from 'app/components/Banner/Banner';
import ErrorModal from 'app/components/Modals/Error';

import { setTokenBalances, checkTrancheAllowances } from 'redux/actions/ethereum';
import { ETHContracts, MaticContracts } from 'services/web3Subscriptions';
import { networkId, maticNetworkId, JCompoundAddress, JAaveAddress, ModeThemes } from 'config/constants';
// Routes
import Earn from 'app/pages/Lend';
import Borrow from 'app/pages/Borrow';
import Trade from 'app/pages/Trade';
import Stake from 'app/pages/Stake';
import NotFound from 'app/pages/NotFound';
import NetworkDetector from './components/NetworkDetector';
import Privacy from './pages/Privacy';
import TermsAndConditions from './pages/Terms&Conditions';
import '../App.css';
const baseRouteUrl = '/:locale(zh|kr|en)?';

const App = ({ setTokenBalances, checkTrancheAllowances, path, ethereum: { address, network }, checkServerStatus, theme }) => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (address) {
      setTokenBalances(address);
      if (network === networkId) checkTrancheAllowances(address, JCompoundAddress);
      if (network === maticNetworkId) checkTrancheAllowances(address, JAaveAddress);
    }
  }, [address, network, setTokenBalances, checkTrancheAllowances]);

  useEffect(() => {
    if (network === networkId) {
      ETHContracts.subscribe();
      // MaticContracts.unsubscribe();
    }
    if (network === maticNetworkId) {
      // MaticContracts.subscribe();
      ETHContracts.unsubscribe();
    }
  }, [network, address, path]);


  const serverError = () => {
    return <ErrorModal openModal={showModal} closeModal={() => setShowModal(false)} />;
  };
  const initApp = () => {
    return (
      <ThemeProvider theme={ModeThemes[theme]}>
        <GlobalStyle />
        <Banner />
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
  checkTrancheAllowances: PropTypes.func.isRequired
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
  checkTrancheAllowances
})(NetworkDetector(App));
