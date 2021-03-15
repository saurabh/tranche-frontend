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

const { stakingSummary } = apiUri;
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
    if (isDesktop && address) {
      getStakingData();
    }
  }, [isDesktop, address, summaryFetchSuccess]);

  useEffect(() => {
    if (isDesktop && address && slice && lpList) {
      setTokenBalance(slice.address, address);
      lpList.forEach((lp) => setTokenBalance(lp.address, address));
    }
  }, [isDesktop, address, lpList, slice, setTokenBalance]);

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
      {!isDesktop && (
        <SummaryCardsWrapper className='container content-container'>
          <button onClick={() => openModal(undefined, 0)}>
            Stake and withdraw
            <span>+ -</span>
          </button>
        </SummaryCardsWrapper>
      )}

      <SummaryCardsWrapper className='container content-container' path={currentPath} isDesktop={isDesktop}>
        <SummaryCard
          title={i18n.t('stake.summary.slice.title')}
          tokenAddress={slice.address}
          value={slice.balance}
          path={currentPath}
          type={'slice'}
          details={''}
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
          title={i18n.t('stake.summary.sliceLP.title')}
          tokenAddress={lp.address}
          lpList={lpList}
          value={lp.balance}
          path={currentPath}
          type={'lp'}
          details={''}
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
          title={i18n.t('stake.summary.sliceRewards.title')}
          value={withdrawn.balance}
          isLoading={false}
          path={currentPath}
          type={'reward'}
          details={''}
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
