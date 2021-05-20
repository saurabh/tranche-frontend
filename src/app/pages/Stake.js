import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import { Layout } from 'app/components/Stake/Layout';
import { PagesData, GoogleAnalyticsTrackingID } from 'config/constants';
import Table from '../components/Stake/Table/Table';
import SummaryCards from 'app/components/Stake/Summary/SummaryCards';


ReactGA.initialize(GoogleAnalyticsTrackingID);
function Stake() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search); 
  })
  return (
    <Layout>
      <SummaryCards />
      <Table pageType={PagesData.borrow.pageType} />
    </Layout>
  );
}

export default withRouter(Stake);