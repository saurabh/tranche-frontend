import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import { Layout } from 'app/components/Earning/Layout';
import SummaryCards from '../components/Earning/Summary/SummaryCards';
import Table from '../components/Earning/Table/Table';
import { PagesData, GoogleAnalyticsTrackingID } from 'config/constants';


ReactGA.initialize(GoogleAnalyticsTrackingID);
function Trade() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search); 
  })
  return (
    <Layout>
      <SummaryCards />
      <Table pageType={PagesData.tranche.pageType} />
    </Layout>
  );
}
export default withRouter(Trade);
