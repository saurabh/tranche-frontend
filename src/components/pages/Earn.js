import React from 'react';
import { Layout } from 'components/common';
import SummaryCards from '../common/Summary/SummaryCards';
import { pageType } from 'config';
import Table from '../common/Table/Table';
export default function Earn() {
  return (
    <Layout>
      {/* <SummaryCards /> */}
      <Table pageType={pageType.EARN} />
    </Layout>
  );
}
