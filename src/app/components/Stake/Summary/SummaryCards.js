import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SummaryCard from './SummaryCard';
import { SummaryCardsWrapper } from './styles/SummaryComponents';
import StakingModal from '../../Modals/StakingModal';
import axios from 'axios';
import { apiUri, serverUrl } from 'config/constants';
import { initOnboard } from 'services/blocknative';
import { readyToTransact } from 'utils/helperFunctions';
import PropTypes from 'prop-types';

import { setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalance } from 'redux/actions/ethereum';
import { summaryFetchSuccess } from 'redux/actions/summaryData';
import i18n from '../../locale/i18n';
import { stakingAllowanceCheck, addStake, withdrawStake } from 'services/contractMethods';
import { ERC20Setup } from 'utils';
import { ApproveBigNumber, txMessage } from 'config';

const { stakingSummary } = apiUri;

const SummaryCards = ({
  path,
  ethereum: { wallet, address, web3, notify, tokenBalance },
  setTokenBalance,
  summaryData: { slice, lp, withdrawn, lpList },
  summaryFetchSuccess
}) => {
  const { pathname } = window.location;
  let parsedPath = pathname.split('/');
  let currentPath = parsedPath[parsedPath.length - 1];
  const toWei = web3.utils.toWei;
  const [modalFirstIsOpen, setFirstIsOpen] = useState(false);
  const [modalSecondIsOpen, setSecondIsOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
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
      const res = await axios(`${serverUrl + stakingSummary + address}`);
      const { result } = res.data;
      summaryFetchSuccess(result);
    };
    if (currentPath === 'stake' && address) {
      getStakingData();
    }
  }, [currentPath, address, summaryFetchSuccess]);

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

  const stakingApproveContract = async (stakingAddress, tokenAddress) => {
    try {
      const token = ERC20Setup(web3, tokenAddress);
      await token.methods
        .approve(stakingAddress, toWei(ApproveBigNumber))
        .send({ from: address })
        .on('transactionHash', (hash) => {
          setApproveLoading(true);
          console.log('true');
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
          emitter.on('txCancel', () => setApproveLoading(false));
          emitter.on('txFailed', () => setApproveLoading(false));
        })
        .on('confirmation', (count) => {
          if (count === 1) {
            setHasAllowance(true);
            setApproveLoading(false);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const adjustStake = (e, stakingAddress, tokenAddress) => {
    try {
      e.preventDefault();
      modalType ? addStake(stakingAddress, tokenAddress) : withdrawStake(stakingAddress, tokenAddress);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {!isDesktop && (
        <SummaryCardsWrapper className='container content-container'>
          <button onClick={() => openModal(undefined, 0)}>
            Stake and withdraw
            <span>+ -</span>
          </button>
          <StakingModal
            // State Values
            path={path}
            modalIsOpen={summaryModal}
            modalType={modalType}
            setModalType={setModalType}
            summaryModal={summaryModal}
            sliceAddress={slice.address}
            lpAddress={lpList && lpList[0].address}
            tokenBalance={tokenBalance}
            lpList={lpList}
            // noBalance={Number(balance) === 0}
            // Functions
            closeModal={closeModal}
            openModal={(bool, num) => openModal(bool, num)}
            hasAllowance={hasAllowance}
            setHasAllowance={setHasAllowance}
            approveLoading={approveLoading}
            // Functions
            stakingApproveContract={stakingApproveContract}
            adjustStake={adjustStake}
          />
        </SummaryCardsWrapper>
      )}
      {isDesktop && (
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
            approveLoading={approveLoading}
            adjustStake={adjustStake}
            stakingApproveContract={stakingApproveContract}
            setHasAllowance={setHasAllowance}
            color='#4441CF'
          />
          <SummaryCard
            title={i18n.t('stake.summary.sliceLP.title')}
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
            approveLoading={approveLoading}
            adjustStake={adjustStake}
            stakingApproveContract={stakingApproveContract}
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
            adjustStake={adjustStake}
            stakingApproveContract={stakingApproveContract}
            modalIsOpen={!modalFirstIsOpen && !modalSecondIsOpen && !modalThirdIsOpen ? summaryModal : modalThirdIsOpen}
            modalType={modalType}
            summaryModal={summaryModal}
            color='#369987'
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
