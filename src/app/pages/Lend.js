import React from 'react';
import { Layout } from 'app/components';
import { PagesData } from 'config/constants';
import Table from '../components/Table/Table';
import SummaryCards from 'app/components/Summary/SummaryCards';

function Earn() {


  return (
    <Layout>
      <SummaryCards />
      <Table pageType={PagesData.borrow.pageType} />
    </Layout>
  );
}

export default Earn;