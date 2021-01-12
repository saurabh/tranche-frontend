import React, { useEffect } from 'react';
import { Layout } from 'app/components';
import { PagesData } from 'config/constants';
import Table from '../components/Table/Table';
import { changeFilter } from 'redux/actions/loans';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import SummaryCards from 'app/components/Summary/SummaryCards';

function Earn({ changeFilter }) {
  const { pathname } = useLocation();

  useEffect(() => {
    changeFilter(null);
  }, [pathname, changeFilter]);

  return (
    <Layout>
      <SummaryCards />
      <Table pageType={PagesData.borrow.pageType} />
    </Layout>
  );
}

export default connect(null, {
  changeFilter
})(Earn);
