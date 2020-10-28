import React, { useEffect } from "react";
import { Layout } from "components/common";
import SummaryCards from "../common/Summary/SummaryCards";
import { PagesData } from "config/constants";
import Table from "../common/Table/Table";
import { changeFilter } from "redux/actions/loans";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";

function Earn({ changeFilter }) {
  const { pathname } = useLocation();

  useEffect(() => {
    changeFilter(null);
  }, [pathname]);

  return (
    <Layout>
      {/* <SummaryCards /> */}
      <Table pageType={PagesData.borrow.pageType} />
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  filterChanged: state.changeFilter,
});

export default connect(mapStateToProps, {
  changeFilter,
})(Earn);
