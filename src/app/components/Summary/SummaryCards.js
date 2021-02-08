import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SummaryCard from './SummaryCard';
import { SummaryCardsWrapper } from './styles/SummaryComponents';
import { serverUrl } from 'config/constants'
import axios from 'axios';
import { apiUri } from 'config/constants';

const { summaryRatio, summaryCollateral, summaryLoan} = apiUri;
const BASE_URL = serverUrl;

const SummaryCards = ({ path }) => {
  const [ratio, setRatio] = useState(null);
  const [collateral, setCollateral] = useState(null);
  const [loan, setLoan] = useState(null);

  const getRatio = async () => {
    const res = await axios(`${BASE_URL+summaryRatio}`); 
    const { result } = res.data;
    setRatio(result);
  };
  const getCollateral = async () => {
    const res = await axios(`${BASE_URL+summaryCollateral}`); 
    const { result } = res.data;
    setCollateral(result);
  };
  const getLoan = async () => {
    const res = await axios(`${BASE_URL+summaryLoan}`); 
    const { result } = res.data;
    setLoan(result);
  };

  useEffect(() => {
    getRatio();
    getCollateral();
    getLoan();
  }, []);

  return (
    <div>
      {loan && collateral && ratio && (
        <SummaryCardsWrapper className='container content-container'>
          <SummaryCard
            title='Decentralized Loans'
            value={loan}
            path={path}
            type='loan'
            details=''
          />
          <SummaryCard
            title='Protocol Collateral'
            value={collateral}
            path={path}
            type='collateral'
            details=''
          />
          <SummaryCard
            title='Collateralization Ratio'
            value={ratio}
            path={path}
            type='ratio'
            details='Total Borrowed vs. Total Held'
          />
        </SummaryCardsWrapper>
      )}
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    path: state.path
  };
};

export default connect(mapStateToProps)(SummaryCards);
