import React, { useEffect, useState } from 'react';
import { Layout } from 'app/components';
import { PagesData } from 'config/constants';
import Table from '../components/Staking/Table/Table';
import { changeFilter } from 'redux/actions/LoansTranchesData';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import SummaryCards from 'app/components/Summary/SummaryCards';

function Staking({ changeFilter }) {
  const { pathname } = useLocation();
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  useEffect(() => {
    changeFilter(null);
  }, [pathname, changeFilter]);

  return (
    <Layout>
      {
        isDesktop &&
        <SummaryCards />
      }
      <Table pageType={PagesData.borrow.pageType} />
    </Layout>
  );
}

export default connect(null, {
  changeFilter
})(Staking);