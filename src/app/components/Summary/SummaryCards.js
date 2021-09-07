import React, { useState, useEffect } from 'react';
import { readyToTransact } from 'utils/helperFunctions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SummaryCard from './SummaryCard';
import { SummaryCardsWrapper } from './styles/SummaryComponents';
import axios from 'axios';
import { apiUri, serverUrl } from 'config/constants';
import { initOnboard } from 'services/blocknative';

import { setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalance } from 'redux/actions/ethereum';
import { summaryFetchSuccess } from 'redux/actions/summaryData';

const { summaryRatio, summaryCollateral, summaryLoan, stakingSummary } = apiUri;

const SummaryCards = ({
  path,
  ethereum: { wallet, address },
  setTokenBalance,
  summaryData: { slice, lp, withdrawn, lpList },
  summaryFetchSuccess
}) => {
  const { pathname } = window.location;
  const [ratio, setRatio] = useState(null);
  const [collateral, setCollateral] = useState(null);
  const [loan, setLoan] = useState(null);
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
      const res = await axios(`${ serverUrl }${ stakingSummary }${ address }`);
      const { result } = res.data;
      summaryFetchSuccess(result);
    };
    if (isDesktop && pathname !== '/stake') {
      getRatio();
      getCollateral();
      getLoan();
    } else if (isDesktop && pathname === '/stake' && address) {
      getStakingData();
    }
  }, [isDesktop, pathname, address, summaryFetchSuccess]);

  const getRatio = async () => {
    const res = await axios(`${serverUrl + summaryRatio}`);
    const { result } = res.data;
    setRatio(result);
    // setRatioIsLoading(false);
  };
  const getCollateral = async () => {
    const res = await axios(`${serverUrl}${summaryCollateral}`);
    const { result } = res.data;
    setCollateral(result);
    setCollateralIsLoading(false);
  };
  const getLoan = async () => {
    const res = await axios(`${serverUrl + summaryLoan}`);
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
    }
    if (num === 2) {
      lpList && lpList.forEach((lp) => setTokenBalance(lp.address, address));
    }
    setModalType(type);
    type ? setHasAllowance(false) : setHasAllowance(true);
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
      {!isDesktop && path === 'stake' && (
        <SummaryCardsWrapper className='container content-container'>
          <button onClick={() => openModal(undefined, 0)}>
            Stake and withdraw
            <span>+ -</span>
          </button>
        </SummaryCardsWrapper>
      )}

      {isDesktop && (
        <SummaryCardsWrapper className='container content-container' path={path} isDesktop={isDesktop}>
          <SummaryCard
            title={path !== 'stake' ? 'Decentralized Loans' : 'Staked SLICE Tokens'}
            isLoading={loanIsLoading}
            value={path !== 'stake' ? loan : slice.balance}
            path={path}
            type={path !== 'stake' ? 'loan' : 'slice'}
            details={path !== 'stake' ? '' : ''}
            openModal={(bool, num = 1) => openModal(bool, num)}
            closeModal={closeModal}
            modalIsOpen={!modalFirstIsOpen && !modalSecondIsOpen && !modalThirdIsOpen ? summaryModal : modalFirstIsOpen}
            modalType={modalType}
            summaryModal={summaryModal}
            hasAllowance={hasAllowance}
            setHasAllowance={setHasAllowance}
          />
          <SummaryCard
            title={path !== 'stake' ? 'Protocol Collateral' : 'Staked SLICE LP Tokens'}
            lpList={lpList}
            value={path !== 'stake' ? collateral : lp.balance}
            isLoading={collateralIsLoading}
            path={path}
            type={path !== 'stake' ? 'collateral' : 'lp'}
            details={path !== 'stake' ? '' : ''}
            openModal={(bool, num = 2) => openModal(bool, num)}
            closeModal={closeModal}
            modalIsOpen={!modalFirstIsOpen && !modalSecondIsOpen && !modalThirdIsOpen ? summaryModal : modalSecondIsOpen}
            modalType={modalType}
            summaryModal={summaryModal}
            hasAllowance={hasAllowance}
            setHasAllowance={setHasAllowance}
          />
          <SummaryCard
            title={path !== 'stake' ? 'Collateralization Ratio' : 'Accrued SLICE Rewards'}
            value={path !== 'stake' ? ratio : withdrawn.balance}
            isLoading={false}
            path={path}
            type={path !== 'stake' ? 'ratio' : 'reward'}
            details={path !== 'stake' ? 'Total Borrowed vs. Total Held' : ''}
            openModal={(bool = null, num = 3) => openModal(bool, num)}
            closeModal={closeModal}
            modalIsOpen={!modalFirstIsOpen && !modalSecondIsOpen && !modalThirdIsOpen ? summaryModal : modalThirdIsOpen}
            modalType={modalType}
            summaryModal={false}
          />
        </SummaryCardsWrapper>
      )}
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
    summaryData: state.summaryData
  };
};

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalance,
  summaryFetchSuccess
})(SummaryCards);
