import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SummaryCard from './SummaryCard';
import { SummaryCardsWrapper } from './styles/SummaryComponents';
import axios from 'axios';
import { apiUri } from 'config/constants';
import { serverUrl } from 'config/constants'

const { summaryRatio, summaryCollateral, summaryLoan} = apiUri;
const BASE_URL = serverUrl;

const SummaryCards = ({ path }) => {
  const [ratio, setRatio] = useState(null);
  const [collateral, setCollateral] = useState(null);
  const [loan, setLoan] = useState(null);
  const [ratioIsLoading, setRatioIsLoading] = useState(false);
  const [collateralIsLoading, setCollateralIsLoading] = useState(false);
  const [loanIsLoading, setLoanIsLoading] = useState(false);

  const getRatio = async () => {
    const res = await axios(`${BASE_URL+summaryRatio}`); 
    const { result } = res.data;
    setRatio(result);
    setRatioIsLoading(false);
  };
  const getCollateral = async () => {
    const res = await axios(`${BASE_URL+summaryCollateral}`); 
    const { result } = res.data;
    setCollateral(result);
    setCollateralIsLoading(false);
  };
  const getLoan = async () => {
    const res = await axios(`${BASE_URL+summaryLoan}`); 
    const { result } = res.data;
    setLoan(result);
    setLoanIsLoading(false);
  };

  useEffect(() => {
    getRatio();
    getCollateral();
    getLoan();
  }, []);

  return (
    <SummaryCardsWrapper className='container content-container'>
      
      <SummaryCard
        title={path !== "staking" ? 'Decentralized Loans' : 'Staked SLICE Tokens'}
        isLoading={loanIsLoading}
        value={loan}
        path={path}
        type='loan'
        details={path !== "staking" ? '' : '$0.00 / 0.00 ETH'}
      />

      <SummaryCard
        title={path !== "staking" ? 'Protocol Collateral' : 'Staked SLICE LP Tokens'}
        value={collateral}
        isLoading={collateralIsLoading}
        path={path}
        type='collateral'
        details={path !== "staking" ? '' : '$0.00 / 0.00 ETH'}
      />

      <SummaryCard
        title={path !== "staking" ? 'Collateralization Ratio' : 'SLICE Rewards Collected'}
        value={ratio}
        isLoading={ratioIsLoading}
        path={path}
        type='ratio'
        details={path !== "staking" ? 'Total Borrowed vs. Total Held' : '$0.00 / 0.00 ETH'}
      />

    </SummaryCardsWrapper>
  );
};
const mapStateToProps = (state) => {
  return {
    path: state.path
  };
};

export default connect(mapStateToProps)(SummaryCards);
