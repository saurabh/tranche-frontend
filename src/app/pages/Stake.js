import React from 'react';
import { Layout } from 'app/components/Layout';
import { PagesData } from 'config/constants';
import Table from '../components/Stake/Table/Table';
import SummaryCards from 'app/components/Summary/SummaryCards';

function Stake() {
  return (
    <Layout>
      <SummaryCards />
      <Table pageType={PagesData.borrow.pageType} />
    </Layout>
  );
}

export default Stake;