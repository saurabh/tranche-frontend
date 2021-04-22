import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SummaryCard from './SummaryCard';
import { SummaryCardsWrapper } from './styles/SummaryComponents';
import axios from 'axios';
import { apiUri, serverUrl } from 'config/constants';
import { initOnboard } from 'services/blocknative';
import { readyToTransact } from 'utils/helperFunctions';
import PropTypes from 'prop-types';

import { setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalance } from 'redux/actions/ethereum';
import { summaryFetchSuccess } from 'redux/actions/summaryData';
import i18n from '../../locale/i18n';

const { stakingSummary } = apiUri;

const SummaryCards = ({ ethereum: { wallet, address }, summaryData: { slice, lp, withdrawn, lpList }, summaryFetchSuccess }) => {
  const { pathname } = window.location;
  let parsedPath = pathname.split('/');
  let currentPath = parsedPath[parsedPath.length - 1];
  const [ModalIsOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(true);
  const [summaryModal, setSummaryModal] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  useEffect(() => {
    const getStakingData = async () => {
      const res = await axios(`${serverUrl + stakingSummary + address}`);
      const { result } = res.data;
      summaryFetchSuccess(result);
    };
    if (currentPath === 'stake' && address) {
      getStakingData();
    }
  }, [currentPath, address, summaryFetchSuccess]);

  const openModal = async (type) => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(true);
    setSummaryModal(false);
  };

  return (
    <div>
      {isDesktop ? (
        <SummaryCardsWrapper className='container content-container' path={currentPath} isDesktop={isDesktop}>
          <SummaryCard
            title={i18n.t('stake.summary.slice.title')}
            tokenAddress={slice.address}
            value={slice.balance}
            path={currentPath}
            type={'slice'}
            details={''}
            closeModal={closeModal}
            summaryModal={summaryModal}
            color='#4441CF'
          />
          <SummaryCard
            title={i18n.t('stake.summary.sliceLP.title')}
            lpList={lpList}
            value={lp.balance}
            path={currentPath}
            type={'lp'}
            details={''}
            closeModal={closeModal}
            summaryModal={summaryModal}
            color='#1E80DA'
          />
          <SummaryCard
            title={i18n.t('stake.summary.sliceRewards.title')}
            value={withdrawn.balance}
            isLoading={false}
            path={currentPath}
            type={'reward'}
            details={''}
            openModal={(bool = null) => openModal(bool)}
            closeModal={closeModal}
            modalIsOpen={ModalIsOpen}
            modalType={modalType}
            summaryModal={summaryModal}
            color='#369987'
          />
        </SummaryCardsWrapper>
      ) : (
        <SummaryCard
          title={i18n.t('stake.summary.sliceRewards.title')}
          value={withdrawn.balance}
          isLoading={false}
          path={currentPath}
          type={'reward'}
          details={''}
          openModal={(bool = null) => openModal(bool)}
          closeModal={closeModal}
          modalIsOpen={ModalIsOpen}
          modalType={modalType}
          summaryModal={summaryModal}
          color='#369987'
        />
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
