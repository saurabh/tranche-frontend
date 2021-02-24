import React, { useEffect } from 'react';
import { Layout } from 'app/components';
import { PagesData } from 'config/constants';
import Table from '../components/Staking/Table/Table';
import { changeFilter } from 'redux/actions/tableData';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import SummaryCards from 'app/components/Summary/SummaryCards';

function Staking({ changeFilter }) {
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
})(Staking);