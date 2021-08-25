import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { serverUrl, apiUri, SLICEAddress } from 'config';
import { getUserStaked, claimRewards, addStake, withdrawStake } from 'services/contractMethods';
import useAnalytics from 'services/analytics';
import { setMigrateStep, setMigrateLoading } from 'redux/actions/tableData';
import { isEqualTo } from 'utils';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { liquidityModal, claimModal, stakingModal, migrateStake, notFound } from './Components';

const { stakingSummaryDetail } = apiUri;

Modal.setAppElement('#root');

const StakingModal = ({
  // Redux
  ethereum: { address },
  data: { stakingList, sliceStakingList, userStakingList, currentStep, migrateLoading, hasMigrated, exchangeRates },
  summaryData: { accruedRewards, totalAccruedRewards },
  theme,
  setMigrateStep,
  setMigrateLoading,
  // State Values
  modalIsOpen,
  type,
  modalType,
  contractAddress,
  tokenAddress,
  title,
  reward,
  remainingCap,
  apy,
  durationIndex,
  duration,
  // Functions
  openModal,
  closeModal
  // API Values,
}) => {
  const Tracker = useAnalytics('ButtonClicks');
  const [modalTypeVar, setModalTypeVar] = useState('');
  const [objId, setObjId] = useState(null);
  const [newSlice, setNewSlice] = useState([]);
  const [oldSlice, setOldSlice] = useState([]);
  const [totalStaked, setTotalStaked] = useState(0);
  const [userStaked, setUserStaked] = useState(0);
  const [stakedShare, setStakedShare] = useState(0);
  const [userStakes, setUserStakes] = useState([]);
  const { slice, lp } = userStakingList;

  useEffect(() => {
    let stakes = [];
    const withDuration = slice.filter((s) => s.duration);
    const withoutDuration = sliceStakingList.filter((s) => !s.duration);
    setNewSlice(sliceStakingList.filter((s) => s.duration));
    setOldSlice(withoutDuration);

    if (modalType === 'claim') {
      stakes = hasMigrated ? withDuration : withDuration.concat(withoutDuration);
    } else {
      if (tokenAddress === SLICEAddress) {
        stakes = duration ? withDuration : withoutDuration;
      } else {
        const lpStake = lp.find((o) => o.tokenAddress === tokenAddress);
        stakes = lpStake ? [lpStake] : [];
      }
    }
    setUserStakes(stakes);
  }, [modalType, duration, lp, slice, sliceStakingList, tokenAddress, hasMigrated]);

  useEffect(() => {
    setModalTypeVar(modalType);
  }, [modalType]);

  useEffect(() => {
    if (modalType === 'withdrawTokens' && address) {
      if (accruedRewards && isEqualTo(accruedRewards[SLICEAddress], 0)) setMigrateStep('withdraw');
      if (sliceStakingList[sliceStakingList.length - 1] && isEqualTo(sliceStakingList[sliceStakingList.length - 1].subscription, 0))
        setMigrateStep('stake');
    }
  }, [modalType, address, accruedRewards, sliceStakingList, setMigrateStep]);

  useEffect(() => {
    const getStakingDetails = async () => {
      const res = await axios(`${serverUrl}${stakingSummaryDetail}${tokenAddress}/${address}`);
      const { result } = res.data;
      setTotalStaked(result.staked);
      let userStaked = await getUserStaked(contractAddress, tokenAddress);
      setUserStaked(userStaked);
      setStakedShare((parseFloat(result.userStaked) / result.staked) * 100);
    };

    modalIsOpen && !duration && tokenAddress && getStakingDetails();
  }, [modalIsOpen, type, duration, tokenAddress, contractAddress, address]);

  const adjustStake = async (e, contractAddress, tokenAddress, durationIndex = false, migrate) => {
    try {
      e.preventDefault();
      migrate && setMigrateLoading(true);
      if (modalType !== 'liqWithdraw') {
        if (migrate) {
          await addStake(contractAddress, tokenAddress, durationIndex, migrate);
          setMigrateLoading(false);
        }
        addStake(contractAddress, tokenAddress, durationIndex);
      } else {
        withdrawStake(contractAddress, tokenAddress);
      }

      modalType === 'liqStake'
        ? Tracker('addStake', 'User address: ' + address)
        : modalType === 'staking'
        ? Tracker('addLockup', 'User address: ' + address)
        : Tracker('withdrawStake', 'User address: ' + address);
      if (!migrate) closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const claimAndProgress = async (claimType) => {
    try {
      setMigrateLoading(true);
      if (claimType === 'rewards') await claimRewards(oldSlice[0].yieldAddress, undefined, true);
      if (claimType === 'oldStake') await withdrawStake(oldSlice[0].contractAddress, oldSlice[0].tokenAddress, true, true);
      setMigrateLoading(false);

      if (claimType === 'skip') setMigrateStep('done');
    } catch (error) {
      console.log(error);
    }
  };

  return modalType === 'claim'
    ? claimModal({
        theme,
        modalIsOpen,
        totalAccruedRewards,
        slice,
        userStakes,
        stakingList,
        sliceStakingList,
        accruedRewards,
        exchangeRates,
        // Functions
        openModal,
        closeModal
      })
    : modalType === 'staking'
    ? stakingModal({
        modalTypeVar,
        theme,
        modalIsOpen,
        type,
        contractAddress,
        tokenAddress,
        apy,
        userStaked,
        userStakes,
        durationIndex,
        duration,
        remainingCap,
        // Functions
        closeModal,
        adjustStake
      })
    : modalTypeVar === 'liqStake' || modalTypeVar === 'liqWithdraw'
    ? liquidityModal({
        modalTypeVar,
        setModalTypeVar,
        theme,
        modalIsOpen,
        type,
        contractAddress,
        tokenAddress,
        title,
        reward,
        apy,
        userStaked,
        totalStaked,
        stakedShare,
        // Functions
        adjustStake,
        closeModal
      })
    : modalType === 'withdrawTokens'
    ? migrateStake({
        theme,
        modalIsOpen,
        currentStep,
        accruedRewards,
        oldSlice,
        migrateLoading,
        claimAndProgress,
        newSlice,
        objId,
        setObjId,
        // Functions
        closeModal
      })
    : notFound({ theme, type, modalIsOpen, closeModal });
};

StakingModal.propTypes = {
  ethereum: PropTypes.object.isRequired,
  summaryData: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  summaryData: state.summaryData,
  data: state.data,
  path: state.path,
  theme: state.theme
});

export default connect(mapStateToProps, { setMigrateStep, setMigrateLoading })(StakingModal);
