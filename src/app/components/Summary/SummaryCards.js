import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SummaryCard from './SummaryCard';
import { SummaryCardsWrapper } from './styles/SummaryComponents';
import axios from 'axios';
import { apiUri } from 'config/constants';
import { serverUrl } from 'config/constants'
import { initOnboard } from 'services/blocknative';
import { readyToTransact } from 'utils/helperFunctions';
import { PagesData, txMessage, StakingAddress, LPTokenAddress, SLICEAddress } from 'config';
import PropTypes from 'prop-types';

import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances,
  setTokenBalance
} from 'redux/actions/ethereum';

const { summaryRatio, summaryCollateral, summaryLoan, stakingSummary } = apiUri;
const BASE_URL = serverUrl;

  const SummaryCards = ({ path, ethereum: { wallet, address }, setTokenBalance}) => {
  const [ratio, setRatio] = useState(null);
  const [collateral, setCollateral] = useState(null);
  const [loan, setLoan] = useState(null);
  const [stakingData, setStakingData] = useState(null);
  const [ratioIsLoading, setRatioIsLoading] = useState(false);
  const [collateralIsLoading, setCollateralIsLoading] = useState(false);
  const [loanIsLoading, setLoanIsLoading] = useState(false);
  const [modalFirstIsOpen, setFirstIsOpen] = useState(false);
  const [modalSecondIsOpen, setSecondIsOpen] = useState(false);
  const [modalType, setModalType] = useState(true);
  const [summaryModal, setSummaryModal] = useState(false);
  const [isLPToken, setIsLPToken] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [hasAllowance, setHasAllowance] = useState(false);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });
  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  const openModal = async (type, num = 0) => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    address = !address ? onboard.getState().address : address;
    let isLP = title.split(' ').includes('LP');
    isLP ? setIsLPToken(true) : setIsLPToken(false);
    setTokenBalance(SLICEAddress, address)
    setTokenBalance(LPTokenAddress, address)
    setModalType(type);
    type ? setHasAllowance(false) : setHasAllowance(true);
    if(num === 0) {
      setSummaryModal(true)
      setFirstIsOpen(false);
      setSecondIsOpen(false);
    }
    else if(num === 1){
      setSummaryModal(false)
      setFirstIsOpen(true);
    }
    else{
      setSummaryModal(false)
      setSecondIsOpen(true);
    }
  };

  const closeModal = () => {
    setFirstIsOpen(false);
    setSecondIsOpen(false);
    setModalType(true);
    setSummaryModal(false);
  };


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
  const getStakingData = async () => {
    const res = await axios(`${BASE_URL+stakingSummary + address}`);
    const { result } = res.data;
    setStakingData(result);
  }
  
  useEffect(() => {
    if(isDesktop && path !== 'stake'){
      getRatio();
      getCollateral();
      getLoan();
    }
    else if(isDesktop && path === 'stake'){
      address && getStakingData();
    }
  }, [isDesktop, path, address]);
  
  return (
    <div>
      { !isDesktop && path === "stake" &&
        <SummaryCardsWrapper className='container content-container'>
          <button onClick={() => openModal(true, 0)}>Stake and withdraw
          <span>+ -</span>
          </button>
        </SummaryCardsWrapper>
      }
      
      <SummaryCardsWrapper className='container content-container' path={path}>
        <SummaryCard
          title={path !== "stake" ? 'Decentralized Loans' : 'Staked SLICE Tokens'}
          isLoading={loanIsLoading}
          value={loan}
          path={path}
          type='loan'
          details={path !== "stake" ? '' : '$0.00 / 0.00 ETH'}
          openModal={(bool, num=1) => openModal(bool, num)}
          closeModal={closeModal}
          modalIsOpen={(!modalFirstIsOpen && !modalSecondIsOpen) ? summaryModal : modalFirstIsOpen}
          modalType={modalType}
          summaryModal={summaryModal}
          isLPToken={isLPToken}
          hasAllowance={hasAllowance}
        />
        <SummaryCard
          title={path !== "stake" ? 'Protocol Collateral' : 'Staked SLICE LP Tokens'}
          value={collateral}
          isLoading={collateralIsLoading}
          path={path}
          type='collateral'
          details={path !== "stake" ? '' : '$0.00 / 0.00 ETH'}
          openModal={(bool, num=2) => openModal(bool, num)}
          closeModal={closeModal}
          modalIsOpen={(!modalFirstIsOpen && !modalSecondIsOpen) ? summaryModal : modalSecondIsOpen}
          modalType={modalType}
          summaryModal={summaryModal}
          isLPToken={isLPToken}
          hasAllowance={hasAllowance}
        />
        <SummaryCard
          title={path !== "stake" ? 'Collateralization Ratio' : 'SLICE Rewards Collected'}
          value={ratio}
          isLoading={ratioIsLoading}
          path={path}
          type='ratio'
          details={path !== "stake" ? 'Total Borrowed vs. Total Held' : '$0.00 / 0.00 ETH'}
          openModal={(bool, num) => openModal(bool, num)}
          closeModal={closeModal}
          modalIsOpen={false}
          modalType={modalType}
          summaryModal={false}
          isLPToken={isLPToken}
          hasAllowance={hasAllowance}
          setHasAllowance={setHasAllowance}
        />
    </SummaryCardsWrapper>
    </div>
  );
};
SummaryCards.propTypes = {
  ethereum: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setWalletAndWeb3: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    path: state.path,
    ethereum: state.ethereum
  };
};

export default connect(mapStateToProps,{
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances,
  setTokenBalance
})(SummaryCards);
