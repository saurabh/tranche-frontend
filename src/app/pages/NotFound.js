import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalances } from 'redux/actions/ethereum';
import { Layout } from 'app/components/Stake/Layout';
import { GoogleAnalyticsTrackingID, ModeThemes } from 'config/constants';
import { NotFoundWrapper } from '../components/Stake/Header/styles/HeaderComponents'
import { Dark404, Light404 } from 'assets';
function NotFound({ ethereum: { address }, theme}) {
  useEffect(() => {
    ReactGA.initialize(GoogleAnalyticsTrackingID, { gaOptions: { userId: address } });
  }, [address]);
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  });
  


  return (
    <Layout>
      <NotFoundWrapper color={ModeThemes[theme].titleColor}>
        <img src={theme === 'light' ? Light404 : Dark404} alt="Not Found"/>
        <h2>Uh oh! Looks like this page doesn’t exist</h2>
        <a href="/">Return Home</a>
      </NotFoundWrapper>
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  theme: state.theme
});

export default connect(mapStateToProps, {setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalances})(withRouter(NotFound));
