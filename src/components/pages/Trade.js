import React from 'react';
import { Layout } from 'components/common';
import SummaryCards from '../common/Summary/SummaryCards';
import Table from '../common/Table/Table';
import { pageType } from 'config';

export default function Trade() {
  return (
    <Layout>
      <SummaryCards />
      <Table pageType={pageType.TRADE} />
    </Layout>
  );
}
