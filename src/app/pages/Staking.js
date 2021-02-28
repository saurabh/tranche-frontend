import React from 'react';
import { Layout } from 'app/components';
import { PagesData } from 'config/constants';
import Table from '../components/Staking/Table/Table';
import SummaryCards from 'app/components/Summary/SummaryCards';

function Staking() {
  return (
    <Layout>
      <SummaryCards />
      <Table pageType={PagesData.borrow.pageType} />
    </Layout>
  );
}

export default Staking;