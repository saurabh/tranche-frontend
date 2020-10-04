import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { loansFetchData } from 'redux/actions/loans';
import { changePath } from 'redux/actions/TogglePath';
import TableHeader from './TableHeader';
import TableHead from './TableHead';
import TableCard from './TableCard';
import styled from 'styled-components';
import LoanService from 'services/loan.service';

const TableWrapper = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #efefef;
  box-sizing: border-box;
  margin: 24px auto;
  border-radius: 12px;
`;

const Table = ({
  HandleNewLoan,
  loansFetchData,
  loans,
  changePath,
  pathChanged,
}) => {
  const { pathname } = useLocation();
  const [path, setPath] = useState('home');

  useEffect(() => {
    const loanListing = async (filter = null) => {
      await loansFetchData({
        skip: 0,
        limit: 10000,
        filter: {
          type: filter //ETH/JNT keep these in constant file
        }
      });
    };
    const parsePath = () => {
      if (pathname === '/') {
        setPath('home');
      } else {
        setPath(pathname.split('/')[1]);
      }
    };

    let currentPath = pathname.split('/')[1];
    changePath(currentPath);
    parsePath();
    loanListing();
  }, [loansFetchData, pathname, changePath]);

  return (
    <div className='container content-container'>
      <TableWrapper>
        <TableHeader HandleNewLoan={HandleNewLoan} path={pathChanged} />
        <div className='table-container'>
          <TableHead />
          <div className='table-content'>
            {loans.map((loan, i) => (
              <TableCard
                key={i}
                loan={loan}
                path={pathChanged}
              />
            ))}
          </div>
        </div>
      </TableWrapper>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loans: state.loans,
    isLoading: state.loansIsLoading,
    pathChanged: state.changePath
  };
};

export default connect(mapStateToProps, {loansFetchData, changePath})(Table);
