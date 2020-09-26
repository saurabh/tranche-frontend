import React from 'react';
import { Layout } from 'components/common';
import SummaryCards from '../common/Summary/SummaryCards';
import Table from '../common/Table/Table';
export default function Earn() {
  return (
    <Layout>
      <SummaryCards />
      <Table />
    </Layout>
  );
}
