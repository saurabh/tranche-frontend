import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from '../components/Layout';
import SummaryCards from '../components/Tranche/Summary/SummaryCards';
import Table from '../components/Tranche/Table/Table';
import { PagesData, GoogleAnalyticsTrackingID } from 'config/constants';

function Earn({ ethereum: { address } }) {
  useEffect(() => {
    ReactGA.initialize(GoogleAnalyticsTrackingID, { gaOptions: { userId: address } });
  }, [address]);
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  });
  return (
    <Layout>
      <SummaryCards />
      <Table pageType={PagesData.tranche.pageType} />
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  ethereum: state.ethereum
});

export default connect(mapStateToProps, null)(withRouter(Earn));
