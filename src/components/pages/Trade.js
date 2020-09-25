import React from 'react';
import { Layout } from 'components/common';
import SummaryCards from '../common/Summary/SummaryCards';
import Table from '../common/Table/Table';
export default function Trade() {
  return (
    <Layout>
      <SummaryCards />
      <Table />
    </Layout>
  );
}
