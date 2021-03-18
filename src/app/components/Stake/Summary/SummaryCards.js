import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SummaryCard from './SummaryCard';
import { SummaryCardsWrapper } from './styles/SummaryComponents';
import axios from 'axios';
import { apiUri, serverUrl } from 'config/constants';
import { initOnboard } from 'services/blocknative';
import { readyToTransact } from 'utils/helperFunctions';
import PropTypes from 'prop-types';

import { setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalances, setTokenBalance } from 'redux/actions/ethereum';
import { summaryFetchSuccess } from 'redux/actions/summaryData';
import i18n from '../../locale/i18n';
import { stakingAllowanceCheck } from 'services/contractMethods';

const { summaryRatio, summaryCollateral, summaryLoan, stakingSummary } = apiUri;
const BASE_URL = serverUrl;

const SummaryCards = ({
  path,
  ethereum: { wallet, address },
  setTokenBalance,
  userSummary: { slice, lp, withdrawn, lpList },
  summaryFetchSuccess
}) => {
  const { pathname } = window.location;
  let parsedPath = pathname.split('/');
  let currentPath = parsedPath[parsedPath.length - 1];
  const [ratio, setRatio] = useState(null);
  const [collateral, setCollateral] = useState(null);
  const [loan, setLoan] = useState(null);
  // const [ratioIsLoading, setRatioIsLoading] = useState(false);
  const [collateralIsLoading, setCollateralIsLoading] = useState(false);
  const [loanIsLoading, setLoanIsLoading] = useState(false);
  const [modalFirstIsOpen, setFirstIsOpen] = useState(false);
  const [modalSecondIsOpen, setSecondIsOpen] = useState(false);
  const [modalThirdIsOpen, setThirdIsOpen] = useState(false);
  const [modalType, setModalType] = useState(true);
  const [summaryModal, setSummaryModal] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [hasAllowance, setHasAllowance] = useState(false);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  useEffect(() => {
    const getStakingData = async () => {
      const res = await axios(`${BASE_URL + stakingSummary + address}`);
      const { result } = res.data;
      summaryFetchSuccess(result);
    };
    if (isDesktop && currentPath !== 'stake') {
      getRatio();
      getCollateral();
      getLoan();
    } else if (isDesktop && currentPath === 'stake' && address) {
      getStakingData();
    }
  }, [isDesktop, currentPath, address, summaryFetchSuccess]);

  useEffect(() => {
    if (isDesktop && currentPath === 'stake' && address && slice && lpList) {
      setTokenBalance(slice.address, address);
      lpList.forEach((lp) => setTokenBalance(lp.address, address));
    }
  }, [isDesktop, currentPath, address, lpList, slice, setTokenBalance]);

  const getRatio = async () => {
    const res = await axios(`${BASE_URL + summaryRatio}`);
    const { result } = res.data;
    setRatio(result);
    // setRatioIsLoading(false);
  };
  const getCollateral = async () => {
    const res = await axios(`${BASE_URL + summaryCollateral}`);
    const { result } = res.data;
    setCollateral(result);
    setCollateralIsLoading(false);
  };
  const getLoan = async () => {
    const res = await axios(`${BASE_URL + summaryLoan}`);
    const { result } = res.data;
    setLoan(result);
    setLoanIsLoading(false);
  };

  const openModal = async (type, num) => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    address = !address ? onboard.getState().address : address;
    if (num === 1) {
      setTokenBalance(slice.address, address);
      if (type) {
        let result = slice ? await stakingAllowanceCheck(slice.address, slice.stakingAddress, address) : false;
        setHasAllowance(result);
      } else setHasAllowance(true);
    }
    if (num === 2) {
      lpList && lpList.forEach((lp) => setTokenBalance(lp.address, address));
      if (type) {
        let result = lpList ? await stakingAllowanceCheck(lpList[0].address, lpList[0].stakingAddress, address) : false;
        setHasAllowance(result);
      } else setHasAllowance(true);
    }
    setModalType(type);
    if (num === 0) {
      setSummaryModal(true);
      setFirstIsOpen(false);
      setSecondIsOpen(false);
      setThirdIsOpen(false);
    } else if (num === 1) {
      setSummaryModal(false);
      setFirstIsOpen(true);
      setSecondIsOpen(false);
      setThirdIsOpen(false);
    } else if (num === 2) {
      setSummaryModal(false);
      setFirstIsOpen(false);
      setSecondIsOpen(true);
      setThirdIsOpen(false);
    } else if (num === 3) {
      setSummaryModal(false);
      setFirstIsOpen(false);
      setSecondIsOpen(false);
      setThirdIsOpen(true);
    }
  };

  const closeModal = () => {
    setFirstIsOpen(false);
    setSecondIsOpen(false);
    setThirdIsOpen(false);
    setModalType(true);
    setSummaryModal(false);
  };

  return (
    <div>
      {!isDesktop && currentPath === 'stake' && (
        <SummaryCardsWrapper className='container content-container'>
          <button onClick={() => openModal(undefined, 0)}>
            Stake and withdraw
            <span>+ -</span>
          </button>
        </SummaryCardsWrapper>
      )}

      <SummaryCardsWrapper className='container content-container' path={currentPath} isDesktop={isDesktop}>
        <SummaryCard
          title={currentPath !== 'stake' ? 'Decentralized Loans' : i18n.t('stake.summary.slice.title')}
          tokenAddress={slice.address}
          isLoading={loanIsLoading}
          value={currentPath !== 'stake' ? loan : slice.balance}
          path={currentPath}
          type={currentPath !== 'stake' ? 'loan' : 'slice'}
          details={currentPath !== 'stake' ? '' : ''}
          openModal={(bool, num = 1) => openModal(bool, num)}
          closeModal={closeModal}
          modalIsOpen={!modalFirstIsOpen && !modalSecondIsOpen && !modalThirdIsOpen ? summaryModal : modalFirstIsOpen}
          modalType={modalType}
          summaryModal={summaryModal}
          hasAllowance={hasAllowance}
          setHasAllowance={setHasAllowance}
          color='#4441CF'
        />
        <SummaryCard
          title={currentPath !== 'stake' ? 'Protocol Collateral' : i18n.t('stake.summary.sliceLP.title')}
          tokenAddress={lp.address}
          lpList={lpList}
          value={currentPath !== 'stake' ? collateral : lp.balance}
          isLoading={collateralIsLoading}
          path={currentPath}
          type={currentPath !== 'stake' ? 'collateral' : 'lp'}
          details={currentPath !== 'stake' ? '' : ''}
          openModal={(bool, num = 2) => openModal(bool, num)}
          closeModal={closeModal}
          modalIsOpen={!modalFirstIsOpen && !modalSecondIsOpen && !modalThirdIsOpen ? summaryModal : modalSecondIsOpen}
          modalType={modalType}
          summaryModal={summaryModal}
          hasAllowance={hasAllowance}
          setHasAllowance={setHasAllowance}
          color='#1E80DA'
        />
        <SummaryCard
          title={currentPath !== 'stake' ? 'Collateralization Ratio' : i18n.t('stake.summary.sliceRewards.title')}
          value={currentPath !== 'stake' ? ratio : withdrawn.balance}
          isLoading={false}
          path={currentPath}
          type={currentPath !== 'stake' ? 'ratio' : 'reward'}
          details={currentPath !== 'stake' ? 'Total Borrowed vs. Total Held' : ''}
          openModal={(bool = null, num = 3) => openModal(bool, num)}
          closeModal={closeModal}
          modalIsOpen={!modalFirstIsOpen && !modalSecondIsOpen && !modalThirdIsOpen ? summaryModal : modalThirdIsOpen}
          modalType={modalType}
          summaryModal={summaryModal}
          color='#369987'
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
  setWalletAndWeb3: PropTypes.func.isRequired,
  summaryFetchSuccess: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    path: state.path,
    ethereum: state.ethereum,
    userSummary: state.userSummary
  };
};

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances,
  setTokenBalance,
  summaryFetchSuccess
})(SummaryCards);
