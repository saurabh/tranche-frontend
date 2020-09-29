import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { loansFetchData } from '../../../redux/actions/loans';

import TableHeader from "./TableHeader";
import TableHead from "./TableHead";
import TableCard from "./TableCard";
import styled from "styled-components";
import LoanService from "services/loan.service";

const TableWrapper = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #efefef;
  box-sizing: border-box;
  margin: 24px auto;
  border-radius: 12px;
`;

function Table({ HandleNewLoan, fetchData, loans }) {
  useEffect(() => {
    loanListing();
  }, []);

  const loanListing = async (filter=null) => {
    await fetchData({
      skip: 0,
      limit: 10000,
      filter: {
        type: filter, //ETH/JNT keep these in constant file
      },
    });
  };

  return (
    <div className="container content-container">
      <TableWrapper>
        <TableHeader HandleNewLoan={HandleNewLoan} />
        <div className="table-container">
          <TableHead />
          <div className="table-content">
            {loans.map((loan, i) => (
              <TableCard key={i} loan={loan} />
            ))}
          </div>
        </div>
      </TableWrapper>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
      loans: state.loans,
      isLoading: state.itemsIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      fetchData: (data) => dispatch(loansFetchData(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);