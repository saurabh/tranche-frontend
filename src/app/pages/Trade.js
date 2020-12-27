import React from 'react';
import { Layout } from 'app/components';
import SummaryCards from '../components/Summary/SummaryCards';
import Table from '../components/Earning/Table/Table';
import { PagesData } from 'config/constants';

export default function Trade() {
  return (
    <Layout>
      <SummaryCards />
      <Table pageType={PagesData.trade.pageType} />
    </Layout>
  );
}
