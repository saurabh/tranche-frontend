import React from 'react';
import { Layout } from 'app/components';
import SummaryCards from '../components/Summary/SummaryCards';
import Table from '../components/Table/Table';
import { Redirect } from 'react-router-dom';
import { PagesData } from 'config/constants';

export default function Trade() {
  if(true){
    return <Redirect to="/borrow" />
  }
  return (
    <Layout>
      <SummaryCards />
      <Table pageType={PagesData.trade.pageType} />
    </Layout>
  );
}
