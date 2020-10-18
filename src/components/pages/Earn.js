import React from 'react';
import { Layout } from 'components/common';
import SummaryCards from '../common/Summary/SummaryCards';
import { PagesData } from 'config/constants';
import Table from '../common/Table/Table';
export default function Earn() {
  return (
    <Layout>
      {/* <SummaryCards /> */}
      <Table pageType={PagesData.borrow.pageType} />
    </Layout>
  );
}
