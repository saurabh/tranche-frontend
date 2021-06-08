import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from 'app/components/Stake/Layout';
import { PagesData, GoogleAnalyticsTrackingID } from 'config/constants';
import Table from '../components/Stake/Table/Table';



function Stake({ ethereum: { address } }) {
  useEffect(() => {
    ReactGA.initialize(GoogleAnalyticsTrackingID, { gaOptions: { userId: address } });    
  },[address])
  useEffect(() => {
    ReactGA.pageview(window.location.pathname); 
  })
  return (
    <Layout>
      <Table pageType={PagesData.borrow.pageType} title="SLICE Staking Pools"/>
      <Table pageType={PagesData.borrow.pageType} title="Liquidity Provider Pools"/>
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  ethereum: state.ethereum
});

export default connect(mapStateToProps, null)(withRouter(Stake));