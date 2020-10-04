import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { loansFetchData } from 'redux/actions/loans';
import { changePath } from 'redux/actions/TogglePath';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableHead from './TableHead';
import TableCard from './TableCard';
import styled from 'styled-components';
import LoanService from 'services/loan.service';
import {
  JLoanEthSetup,
  JLoanTokenSetup,
  DAISetup,
  USDCSetup
} from 'utils/contractConstructor';
import { DAI, USDC } from 'config/constants';

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
  fetchData,
  loans,
  changePath,
  pathChanged,
  ethereum: { address, network, balance, wallet, web3, notify }
}) => {
  const { pathname } = useLocation();
  const [path, setPath] = useState('home');
  const toWei = web3.utils.toWei;

  useEffect(() => {
    const loanListing = async (filter = null) => {
      await fetchData({
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
  }, [fetchData, pathname, changePath]);

  const approveEthLoan = async (loanAddress, loanAmount, stableCoinAddress) => {
    try {
      const JLoanEth = JLoanEthSetup(web3, loanAddress);
      const USDC = USDCSetup(web3);
      let userallowance = await USDC.methods
        .allowance(address, loanAddress)
        .call({ from: address });
      if (loanAmount > userallowance) {
        await USDC.methods
          .approve(loanAddress, loanAmount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          });
        await JLoanEth.methods
          .lenderSendStableCoins(stableCoinAddress)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          });
      } else {
        await JLoanEth.methods
          .lenderSendStableCoins(stableCoinAddress)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const approveTokenLoan = async (
    loanAddress,
    loanAmount,
    stableCoinAddress
  ) => {
    try {
      const JLoanToken = JLoanTokenSetup(web3, loanAddress);
      const USDC = USDCSetup(web3);
      let userallowance = await USDC.methods
        .allowance(address, loanAddress)
        .call({ from: address });
      if (loanAmount > userallowance) {
        await USDC.methods
          .approve(loanAddress, loanAmount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          });
        await JLoanToken.methods
          .lenderSendStableCoins(stableCoinAddress)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          });
      } else {
        await JLoanToken.methods
          .lenderSendStableCoins(stableCoinAddress)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const approveLoan = (
    cryptoFromLenderName,
    loanAddress,
    loanAmount,
    stableCoinAddress
  ) => {
    loanAmount = toWei(loanAmount.toString());
    if (cryptoFromLenderName === DAI) {
      approveEthLoan(loanAddress, loanAmount, stableCoinAddress);
    } else if (cryptoFromLenderName === USDC) {
      approveTokenLoan(loanAddress, loanAmount, stableCoinAddress);
    }
  };
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
                approveLoan={approveLoan}
              />
            ))}
          </div>
        </div>
      </TableWrapper>
    </div>
  );
};

Table.propTypes = {
  ethereum: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    ethereum: state.ethereum,
    loans: state.loans,
    isLoading: state.loansIsLoading,
    pathChanged: state.changePath
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (data) => dispatch(loansFetchData(data)),
    changePath: (path) => dispatch(changePath(path))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);
