import React from 'react';
import { Layout } from 'app/components/Earning/Layout';
import SummaryCards from '../components/Earning/Summary/SummaryCards';
import Table from '../components/Earning/Table/Table';
import { PagesData } from 'config/constants';

export default function Trade() {
  return (
    <Layout>
      <SummaryCards />
      <Table pageType={PagesData.tranche.pageType} />
    </Layout>
  );
}