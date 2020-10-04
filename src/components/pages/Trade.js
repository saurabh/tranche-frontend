import React from 'react';
import { Layout } from 'components/common';
import SummaryCards from '../common/Summary/SummaryCards';
import Table from '../common/Table/Table';
import { Redirect } from 'react-router-dom';
import { pageType } from 'config/constants';

export default function Trade() {
  if(true){
    return <Redirect to="/borrow" />
  }
  return (
    <Layout>
      <SummaryCards />
      <Table pageType={pageType.TRADE} />
    </Layout>
  );
}
