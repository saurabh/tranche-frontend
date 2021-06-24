import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import StakingForm from '../Form/Staking';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal, CloseModalWhite, ETHCARD, Lock, LockLight, TrancheIcon, TrancheStake, Migrated } from 'assets';
import { addrShortener, roundNumber } from 'utils';

import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  StakingModalContentWrapper,
  StakingModalContent,
  StakingModalClose,
  ClaimModalHeader,
  ClaimModalTableWrapper,
  ClaimModalTableTitle,
  ClaimModalTableSubTitle,
  ClaimModalTableHead,
  ClaimModalTableRow,
  ClaimModalTableCol,
  ClaimModalTableBtn,
  StakingModalContentSideWrapper,
  StakingModalContentSide,
  BreakLink,
  StakingModalContentSideTitle,
  StakingModalContentSideHeader,
  StakingModalContentSideHeaderBoxWrapper,
  StakingModalContentSideHeaderBox,
  StakingModalContentSideHeaderImg,
  StakingModalContentSideHeaderText,
  StakeModalPoolTable,
  StakeModalPoolTableTitle,
  StakeModalPoolTableHead,
  StakeModalPoolTableRow,
  StakeModalPoolTableCol,
  StakeModalNavigationWrapper,
  StakeModalNavigationBtn,
  StakeModalFormWrapper,
  StakeModalFormBtn,
  StakeModalFormInputWrapper,
  StakeModalFormInput,
  EstimatedText,
  SliceNotFound,
  SliceNotFoundBtn,
  ModalHeader,
  StakingModalHeader,
  StepProgressBarWrapper,
  ProgressBarStep,
  ProgressBarLineWrapper,
  ProgressBarDashedLine,
  ProgressBarLine,
  InputTag,
  StakingMigrateModalContent,
  RewardsAmountWrapper,
  RewardsAmountCardsWrapper,
  RewardsAmountCard,
  StakeNewWrapper,
  StakeNewTable,
  StakeNewCol,
  StakeNewTableHead,
  StakeNewTableCards,
  StakeNewTableCard,
  StakeNewColFirst,
  StakeNewColImg,
  StakeNewColText,
  SliceMigratedWrapper,
  SliceMigratedText,
  LoadingButton,
  LoadingButtonCircle,
  StakingModalChangeBtn,
  StakingMigrateModalContentWrapper
} from './styles/ModalsComponents';
import { Countdown } from '../Stake/Header/styles/HeaderComponents';
import ProgressBar from '../Stake/ProgressBar/ProgressBar';
import { ModeThemes } from 'config';
import i18n from '../locale/i18n';
import { LiquidityIcons } from 'config';
import moment from 'moment';

const NotFoundStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '1000'
  },
  content: {
    position: 'relative',
    maxWidth: '292px',
    width: '100%',
    minHeight: '245px',
    //height: '326px',
    height: 'auto',
    border: 'none',
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};
const MigrateStake = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '1000'
  },
  content: {
    position: 'relative',
    maxWidth: '473px',
    width: '100%',
    minHeight: '457px',
    //height: '326px',
    height: 'auto',
    border: 'none',
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};
const FirstCustomStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '1000'
  },
  content: {
    position: 'relative',
    maxWidth: '731px',
    width: '100%',
    minHeight: '634px',
    //height: '326px',
    height: 'auto',
    border: 'none',
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};
const stakingModalStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '1000'
  },
  content: {
    position: 'relative',
    maxWidth: '731px',
    width: '100%',
    minHeight: '454px',
    //height: '326px',
    height: 'auto',
    border: 'none',
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};

Modal.setAppElement('#root');

const StakingModal = ({
  // State Values
  modalIsOpen,
  theme,
  type,
  modalType,
  progress,
  contractAddress,
  tokenAddress,
  stakingAddress,
  hasAllowance,
  approveLoading,
  title,
  rewards,
  timerData,
  data,
  apy,
  // Functions
  stakingApproveContract,
  adjustStake,
  closeModal

  // API Values,
}) => {
  const [modalTypeVar, setModalTypeVar] = useState('');
  const [objId, setObjId] = useState(null);
  const [currentStep, setCurrentStep] = useState('claim');

  const formatTime = (value) =>{
    let format = (val) => moment().add(value, 'minutes').diff(moment(), val)
    let years =  format('years');
    let months =  format('months');
    let weeks =  format('weeks');
    let days =  format('days');
    let hours =  format('hours');
    let mintues =  format('mintues');

    return years !== 0 ? years + ' years' : months !== 0 ? months + ' months' : weeks !== 0 ? weeks + ' weeks' : days !== 0 ? days + ' days' : hours !== 0 ? hours + ' hours' : mintues !== 0 ? mintues + ' mintues' : ""
  }
  

  useEffect(() => {
    setModalTypeVar(modalType);
  }, [modalType]);

  const closeModalMigrate = () =>{
    setTimeout(() => {
      setCurrentStep("claim");
    }, 300)
    closeModal();
  }

  const claimModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={FirstCustomStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Claim'
      >
        <StakingModalContentWrapper height='634px' backgroundColor={ModeThemes[theme].ModalBackground}>
          <StakingModalContent height='634px'>
            <StakingModalClose>
              <button onClick={closeModal}>
                <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='close' />
              </button>
            </StakingModalClose>
            <ClaimModalHeader textColor={ModeThemes[theme].ModalText}>
              <h2>Total Accrued Rewards</h2>
              <h2>
                100 SLICE <span>(Current Value is $70)</span>
              </h2>
            </ClaimModalHeader>
            <ClaimModalTableWrapper>
              <ClaimModalTableTitle textColor={ModeThemes[theme].ModalText}>
                <h2>SLICE Pools</h2>
              </ClaimModalTableTitle>

              <ClaimModalTableHead BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol pair head sliceliquidityFirstLast TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>{i18n.t('pair')}</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>{i18n.t('depositDate')}</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>{i18n.t('endDate')}</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Total Locked</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Rewards</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceliquidityFirstLast manage TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Manage</h2>
                </ClaimModalTableCol>
              </ClaimModalTableHead>

              <ClaimModalTableRow BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol pair col sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText}>
                  <div>
                    <img src={ETHCARD} alt='img' />
                    <img src={ETHCARD} alt='img' />
                  </div>
                  <h2>Slice</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2021</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2022</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol staked textColor={ModeThemes[theme].ModalText}>
                  <h2>
                    <img src={Lock} alt='lock' /> 120.00
                  </h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>0 SLICE</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceliquidityFirstLast>
                  <ClaimModalTableBtn>{i18n.t('claim')}</ClaimModalTableBtn>
                </ClaimModalTableCol>
              </ClaimModalTableRow>

              <ClaimModalTableRow BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol pair col sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText}>
                  <div>
                    <img src={ETHCARD} alt='img' />
                    <img src={ETHCARD} alt='img' />
                  </div>
                  <h2>Slice</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2021</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2022</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol staked textColor={ModeThemes[theme].ModalText}>
                  <h2>
                    <img src={Lock} alt='lock' /> 120.00
                  </h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>0 SLICE</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceliquidityFirstLast>
                  <ClaimModalTableBtn>{i18n.t('claim')}</ClaimModalTableBtn>
                </ClaimModalTableCol>
              </ClaimModalTableRow>

              <ClaimModalTableRow BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol col pair sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText}>
                  <div>
                    <img src={ETHCARD} alt='img' />
                    <img src={ETHCARD} alt='img' />
                  </div>
                  <h2>Slice</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2021</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2022</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol staked textColor={ModeThemes[theme].ModalText}>
                  <h2>
                    <img src={Lock} alt='lock' /> 120.00
                  </h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>0 SLICE</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceliquidityFirstLast>
                  <ClaimModalTableBtn>{i18n.t('claim')}</ClaimModalTableBtn>
                </ClaimModalTableCol>
              </ClaimModalTableRow>
            </ClaimModalTableWrapper>
            <ClaimModalTableWrapper>
              <ClaimModalTableTitle textColor={ModeThemes[theme].ModalText}>
                <h2>Liquidity Provider Pools</h2>
              </ClaimModalTableTitle>
              <ClaimModalTableSubTitle textColor={ModeThemes[theme].ModalText}>
                <h2>Next Liqudity Provider Pool Distribution</h2>
                <Countdown modal>
                  <h2>
                    {timerData && timerData.days}
                    <span>days</span>
                  </h2>
                  <h2>
                    {timerData && timerData.hours}
                    <span>hours</span>
                  </h2>
                  <h2>
                    {timerData && timerData.minutes}
                    <span>minutes</span>
                  </h2>
                  <h2>
                    {timerData && timerData.seconds}
                    <span>seconds</span>
                  </h2>
                </Countdown>
              </ClaimModalTableSubTitle>

              <ProgressBar progress={progress} width='100' colorOne='rgba(160, 160, 160, 0.15)' colorTwo='#369987' />

              <ClaimModalTableHead BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol pair head sliceliquidityFirstLast TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Pair</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head liquidityCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>{i18n.t('depositDate')}</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head liquidityCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Total Staked</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head liquidityCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Rewards</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceliquidityFirstLast manage TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Manage</h2>
                </ClaimModalTableCol>
              </ClaimModalTableHead>

              <ClaimModalTableRow BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol pair col sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText}>
                  <div>
                    <img src={ETHCARD} alt='img' />
                    <img src={ETHCARD} alt='img' />
                  </div>
                  <h2>SLICE-ETH LP</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col liquidityCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2021</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col liquidityCol staked textColor={ModeThemes[theme].ModalText}>
                  <h2>
                    <img src={Lock} alt='lock' /> 120.00
                  </h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col liquidityCol textColor={ModeThemes[theme].ModalText}>
                  <h2>0 SLICE</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceliquidityFirstLast>
                  <ClaimModalTableBtn>{i18n.t('claim')}</ClaimModalTableBtn>
                </ClaimModalTableCol>
              </ClaimModalTableRow>

              <ClaimModalTableRow BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol pair col sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText}>
                  <div>
                    <img src={ETHCARD} alt='img' />
                    <img src={ETHCARD} alt='img' />
                  </div>
                  <h2>SLICE-ETH LP</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col liquidityCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2021</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col liquidityCol staked textColor={ModeThemes[theme].ModalText}>
                  <h2>
                    <img src={Lock} alt='lock' /> 120.00
                  </h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col liquidityCol textColor={ModeThemes[theme].ModalText}>
                  <h2>0 SLICE</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceliquidityFirstLast>
                  <ClaimModalTableBtn>{i18n.t('claim')}</ClaimModalTableBtn>
                </ClaimModalTableCol>
              </ClaimModalTableRow>
            </ClaimModalTableWrapper>
          </StakingModalContent>
        </StakingModalContentWrapper>
      </Modal>
    );
  };

  const stakingModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={stakingModalStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Claim'
        portalClassName='stakeModal'
      >
        <StakingModalContentWrapper height='454px' backgroundColor={ModeThemes[theme].ModalBackground}>
          <StakingModalContent height='454px'>
            <StakingModalClose>
              <button onClick={closeModal}>
                <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='close' />
              </button>
            </StakingModalClose>

            <StakingModalContentSideWrapper>
              <StakingModalContentSide>
                <StakingModalContentSideTitle textColor={ModeThemes[theme].ModalText}>
                  <h2>{i18n.t('poolInfo')}</h2>
                </StakingModalContentSideTitle>

                <StakingModalContentSideHeader BoxColor={ModeThemes[theme].BoxColor}>
                  <StakingModalContentSideHeaderImg stake>
                    <img src={TrancheStake} alt='img' />
                  </StakingModalContentSideHeaderImg>
                  <StakingModalContentSideHeaderText boxText={ModeThemes[theme].boxText} textColor={ModeThemes[theme].ModalText}>
                    <h2>{type} STAKING POOL</h2>
                    <h2>{contractAddress}</h2>
                  </StakingModalContentSideHeaderText>
                </StakingModalContentSideHeader>
                <StakingModalContentSideHeaderBoxWrapper>
                  <StakingModalContentSideHeaderBox
                    stake
                    BoxColor={ModeThemes[theme].BoxColor}
                    textColor={ModeThemes[theme].ModalText}
                    BoxColorText={ModeThemes[theme].BoxColorText}
                  >
                    <h2>{i18n.t('lockup')}</h2>
                    <h2>1 year</h2>
                  </StakingModalContentSideHeaderBox>
                  <StakingModalContentSideHeaderBox
                    stake
                    BoxColor={ModeThemes[theme].BoxColor}
                    textColor={ModeThemes[theme].ModalText}
                    BoxColorText={ModeThemes[theme].BoxColorText}
                  >
                    <h2>APY</h2>
                    <h2>{roundNumber(apy, false)}%</h2>
                  </StakingModalContentSideHeaderBox>
                  <StakingModalContentSideHeaderBox
                    BoxColor={ModeThemes[theme].BoxColor}
                    textColor={ModeThemes[theme].ModalText}
                    BoxColorText={ModeThemes[theme].BoxColorText}
                  >
                    <h2>Pool Capacity</h2>
                    <h2>{roundNumber(rewards, false)} SLICE</h2>
                  </StakingModalContentSideHeaderBox>
                </StakingModalContentSideHeaderBoxWrapper>

                <StakeModalPoolTable>
                  <StakeModalPoolTableTitle textColor={ModeThemes[theme].ModalText}>
                    <h2>{i18n.t('yourStakes')}</h2>
                  </StakeModalPoolTableTitle>
                  <StakeModalPoolTableHead>
                    <StakeModalPoolTableCol head stake TableHeadText={ModeThemes[theme].TableHeadText}>
                      <h2>{i18n.t('depositDate')}</h2>
                    </StakeModalPoolTableCol>
                    <StakeModalPoolTableCol head stake TableHeadText={ModeThemes[theme].TableHeadText}>
                      <h2>{i18n.t('endDate')}</h2>
                    </StakeModalPoolTableCol>
                    <StakeModalPoolTableCol head stake TableHeadText={ModeThemes[theme].TableHeadText}>
                      <h2>total locked</h2>
                    </StakeModalPoolTableCol>
                  </StakeModalPoolTableHead>
                </StakeModalPoolTable>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                    <h2>MAY 30 2021</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                    <h2>1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                    <h2>
                      <img src={LockLight} alt='img' />
                      1030 SLICE
                    </h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                    <h2>MAY 30 2021</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                    <h2>1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                    <h2>
                      <img src={LockLight} alt='img' />
                      1030 SLICE
                    </h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                    <h2>MAY 30 2021</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                    <h2>1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                    <h2>
                      <img src={LockLight} alt='img' />
                      1030 SLICE
                    </h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>
              </StakingModalContentSide>

              <BreakLink>
                <span></span>
              </BreakLink>

              <StakingModalContentSide>
                <StakingModalContentSideTitle textColor={ModeThemes[theme].ModalText}> 
                  <h2>Manage</h2>
                </StakingModalContentSideTitle>

                <StakingForm 
                  modalTypeVar={modalTypeVar} 
                  type={type} tokenAddress={tokenAddress}
                  stakingAddress={stakingAddress}
                  hasAllowance={hasAllowance}
                  approveLoading={approveLoading}
                  stakingApproveContract={stakingApproveContract}
                  adjustStake={adjustStake}
                />
              </StakingModalContentSide>
            </StakingModalContentSideWrapper>
          </StakingModalContent>
        </StakingModalContentWrapper>
      </Modal>
    );
  };

  const liquidityModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={stakingModalStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Claim'
        portalClassName='stakeModal'
      >
        <StakingModalContentWrapper height='454px' backgroundColor={ModeThemes[theme].ModalBackground}>
          <StakingModalContent height='454px'>
            <StakingModalClose>
              <button onClick={closeModal}>
                <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='close' />
              </button>
            </StakingModalClose>

            <StakingModalContentSideWrapper>
              <StakingModalContentSide>
                <StakingModalContentSideTitle textColor={ModeThemes[theme].ModalText}>
                  <h2>Pool Info</h2>
                </StakingModalContentSideTitle>

                <StakingModalContentSideHeader BoxColor={ModeThemes[theme].BoxColor}>
                  <StakingModalContentSideHeaderImg>
                    <img src={TrancheStake} alt='img' />
                    {title === 'Liquidity Provider Pools' && <img src={LiquidityIcons[type && type]} alt='Tranche' />}
                  </StakingModalContentSideHeaderImg>
                  <StakingModalContentSideHeaderText textColor={ModeThemes[theme].ModalText} boxText={ModeThemes[theme].boxText}>
                    <h2>{type}</h2>
                    <h2>{contractAddress}</h2>
                  </StakingModalContentSideHeaderText>
                </StakingModalContentSideHeader>
                <StakingModalContentSideHeaderBoxWrapper>
                  <StakingModalContentSideHeaderBox
                    textColor={ModeThemes[theme].ModalText}
                    BoxColor={ModeThemes[theme].BoxColor}
                    BoxColorText={ModeThemes[theme].BoxColorText}
                  >
                    <h2>APY</h2>
                    <h2>{roundNumber(apy, false)}%</h2>
                  </StakingModalContentSideHeaderBox>
                  <StakingModalContentSideHeaderBox
                    textColor={ModeThemes[theme].ModalText}
                    BoxColor={ModeThemes[theme].BoxColor}
                    BoxColorText={ModeThemes[theme].BoxColorText}
                  >
                    <h2>EPOCH REWARDS</h2>
                    <h2>{roundNumber(rewards, false)} SLICE</h2>
                  </StakingModalContentSideHeaderBox>
                </StakingModalContentSideHeaderBoxWrapper>

                <StakeModalPoolTable>
                  <StakeModalPoolTableTitle textColor={ModeThemes[theme].ModalText}>
                    <h2>{i18n.t('yourStakes')}</h2>
                  </StakeModalPoolTableTitle>
                  <StakeModalPoolTableHead>
                    <StakeModalPoolTableCol head TableHeadText={ModeThemes[theme].TableHeadText}>
                      <h2>{i18n.t('depositDate')}</h2>
                    </StakeModalPoolTableCol>
                    <StakeModalPoolTableCol head TableHeadText={ModeThemes[theme].TableHeadText}>
                      <h2>STAKED AMOUNT</h2>
                    </StakeModalPoolTableCol>
                  </StakeModalPoolTableHead>
                </StakeModalPoolTable>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                    <h2>MAY 30 2021</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                    <h2>1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                    <h2>MAY 30 2021</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                    <h2>1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                    <h2>MAY 30 2021</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                    <h2>1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>
              </StakingModalContentSide>

              <BreakLink>
                <span></span>
              </BreakLink>

              <StakingModalContentSide>
                <StakingModalContentSideTitle textColor={ModeThemes[theme].ModalText}>
                  <h2>Manage</h2>
                </StakingModalContentSideTitle>
                <StakeModalNavigationWrapper
                  modalTypeVar={modalTypeVar}
                  stakeBoxBackground={ModeThemes[theme].stakeBoxBackground}
                  stakeModalBoxBackground={ModeThemes[theme].stakeModalBoxBackground}
                  StakeModalNavigationBorder={ModeThemes[theme].StakeModalNavigationBorder}
                  theme={theme}
                >
                  <span></span>
                  <StakeModalNavigationBtn
                    stakeModalBoxShadow={ModeThemes[theme].stakeModalBoxShadow}
                    stakeModalBoxBackground={ModeThemes[theme].stakeModalBoxBackground}
                    StakeModalNavigationText={ModeThemes[theme].StakeModalNavigationText}
                    onClick={() => setModalTypeVar('liqStake')}
                    active={modalTypeVar === 'liqStake'}
                    Stake
                  >
                    Stake
                  </StakeModalNavigationBtn>
                  <StakeModalNavigationBtn
                    stakeModalBoxShadow={ModeThemes[theme].stakeModalBoxShadow}
                    stakeModalBoxBackground={ModeThemes[theme].stakeModalBoxBackground}
                    StakeModalNavigationText={ModeThemes[theme].StakeModalNavigationText}
                    onClick={() => setModalTypeVar('liqWithdraw')}
                    active={modalTypeVar === 'liqWithdraw'}
                    Withdraw
                  >
                    Withdraw
                  </StakeModalNavigationBtn>
                </StakeModalNavigationWrapper>

                <StakingForm 
                  modalTypeVar={modalTypeVar} 
                  type={type} tokenAddress={tokenAddress}
                  stakingAddress={stakingAddress}
                  hasAllowance={hasAllowance}
                  approveLoading={approveLoading}
                  stakingApproveContract={stakingApproveContract}
                  adjustStake={adjustStake}
                />
              </StakingModalContentSide>
            </StakingModalContentSideWrapper>
          </StakingModalContent>
        </StakingModalContentWrapper>
      </Modal>
    );
  };

  const notFound = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={NotFoundStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
        portalClassName='notFound'
      >
        <ModalHeader notFound ModalBackground={ModeThemes[theme].ModalBackground}>
          <button onClick={() => closeModal()}>
            <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
          </button>
        </ModalHeader>
        {type === 'SLICE/DAI LP' || type === 'SLICE/ETH LP' ? (
          <SliceNotFound ModalBackground={ModeThemes[theme].ModalBackground} ModalText={ModeThemes[theme].ModalText}>
            <p>{i18n.t('stake.modal.DontHaveSliceLP')}</p>
            <SliceNotFoundBtn color='#1E80DA' ModalBackground={ModeThemes[theme].SelectedStaking}>
              <a
                href='https://app.uniswap.org/#/swap?outputCurrency=0x0aee8703d34dd9ae107386d3eff22ae75dd616d1'
                target='_blank'
                rel='noopener noreferrer'
              >
                {i18n.t('stake.modal.getSliceLP')}
              </a>
            </SliceNotFoundBtn>
          </SliceNotFound>
        ) : (
          <SliceNotFound ModalBackground={ModeThemes[theme].ModalBackground} ModalText={ModeThemes[theme].ModalText}>
            <p>{i18n.t('stake.modal.DontHaveSlice')}</p>
            <SliceNotFoundBtn color='#4441CF' ModalBackground={ModeThemes[theme].SelectedStaking}>
              <a
                href='https://app.uniswap.org/#/swap?outputCurrency=0x0aee8703d34dd9ae107386d3eff22ae75dd616d1'
                target='_blank'
                rel='noopener noreferrer'
              >
                {i18n.t('stake.modal.getSlice')}
              </a>
            </SliceNotFoundBtn>
          </SliceNotFound>
        )}
      </Modal>
    );
  };

  const migrateStake = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={MigrateStake}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
        portalClassName='migrateStake'
      >
        <StakingModalContentWrapper height='457px' backgroundColor={ModeThemes[theme].ModalBackground} migrateStake>
          <StakingModalContent height='457px' textColor={ModeThemes[theme].ModalText} migrateStake>
            <StakingModalHeader>
              <StakingModalContentSideTitle textColor={ModeThemes[theme].ModalText} migrate>
                <h2>Migrate Tokens</h2>
                <StakingModalClose migrate>
                  <button onClick={closeModalMigrate}>
                    <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='close' />
                  </button>
                </StakingModalClose>
              </StakingModalContentSideTitle>

              <StepProgressBarWrapper Claim>
                <ProgressBarStep 
                MigrateProgressTextActive={ModeThemes[theme].MigrateProgressTextActive}
                MigrateProgressTextPending={ModeThemes[theme].MigrateProgressTextPending}
                MigrateStepBorder={ModeThemes[theme].MigrateStepBorder}
                MigrateStepTextPending={ModeThemes[theme].MigrateStepTextPending}
                MigrateStepText={ModeThemes[theme].MigrateStepText}
                active done={currentStep==="withdraw" || currentStep==="stake" || currentStep==="done"}>
                  <span>1</span>
                  <h2>{i18n.t('claim')}</h2>
                </ProgressBarStep>


                <ProgressBarLineWrapper lineOne>
                  <ProgressBarDashedLine
                  MigrateProgressLine={ModeThemes[theme].MigrateProgressLine}
                   done={currentStep==="withdraw" || currentStep==="stake" || currentStep==="done"}></ProgressBarDashedLine>
                  <ProgressBarLine 
                  MigrateProgressLine={ModeThemes[theme].MigrateProgressLine}

                  done={currentStep==="withdraw" || currentStep==="stake" || currentStep==="done"}></ProgressBarLine>
                </ProgressBarLineWrapper>

                <ProgressBarStep 
                MigrateProgressTextActive={ModeThemes[theme].MigrateProgressTextActive}
                MigrateProgressTextPending={ModeThemes[theme].MigrateProgressTextPending}
                MigrateStepBorder={ModeThemes[theme].MigrateStepBorder}
                MigrateStepTextPending={ModeThemes[theme].MigrateStepTextPending}
                MigrateStepText={ModeThemes[theme].MigrateStepText}
                
                Withdraw active={currentStep==="withdraw"} done={currentStep==="stake" || currentStep==="done"}>
                  <span>2</span>
                  <h2>Withdraw</h2>
                </ProgressBarStep>

                <ProgressBarLineWrapper lineTwo>
                  <ProgressBarDashedLine 
                  MigrateProgressLine={ModeThemes[theme].MigrateProgressLine}
                  
                  done={currentStep==="stake" || currentStep==="done"}></ProgressBarDashedLine>
                  <ProgressBarLine 
                  MigrateProgressLine={ModeThemes[theme].MigrateProgressLine}

                  done={currentStep==="stake" || currentStep==="done"}></ProgressBarLine>
                </ProgressBarLineWrapper>

                <ProgressBarStep 
                MigrateProgressTextActive={ModeThemes[theme].MigrateProgressTextActive}
                MigrateProgressTextPending={ModeThemes[theme].MigrateProgressTextPending}
                MigrateStepBorder={ModeThemes[theme].MigrateStepBorder}
                MigrateStepTextPending={ModeThemes[theme].MigrateStepTextPending}
                MigrateStepText={ModeThemes[theme].MigrateStepText}
                
                Stake active={currentStep==="stake"} done={currentStep==="done"}>
                  <span>3</span>
                  <h2>Stake</h2>
                </ProgressBarStep>
              </StepProgressBarWrapper>
            </StakingModalHeader>

            {
              currentStep === "claim" ?
              migrateClaim() :
              currentStep === "withdraw" ?
              migrateWithdraw() :
              currentStep === "stake" ?
              migrateStakeSkip() :
              currentStep === "done" ?
              migrateDone() : ""
            }

            
          </StakingModalContent>
        </StakingModalContentWrapper>
      </Modal>
    );
  };


  const migrateClaim = () =>{
    return(
      <StakingMigrateModalContent>

        <RewardsAmountWrapper MigrateContentTitle={ModeThemes[theme].MigrateContentTitle}>  
          <h2>{i18n.t('claimSlicePools')}</h2>
          <RewardsAmountCardsWrapper>
            <RewardsAmountCard MigrateClaimCardBackground={ModeThemes[theme].MigrateClaimCardBackground} MigrateClaimCardTitle={ModeThemes[theme].MigrateClaimCardTitle} MigrateClaimCardValue={ModeThemes[theme].MigrateClaimCardValue}>
              <h2>{i18n.t('AmountRewards')}</h2>
              <h2>1000<span><img src={TrancheStake} alt=""/>Slice</span></h2>
            </RewardsAmountCard>
  
            <RewardsAmountCard MigrateClaimCardBackground={ModeThemes[theme].MigrateClaimCardBackground} MigrateClaimCardTitle={ModeThemes[theme].MigrateClaimCardTitle} MigrateClaimCardValue={ModeThemes[theme].MigrateClaimCardValue}>
              <h2>{i18n.t('AmountRewards')}</h2>
              <h2>1000<span><img src={TrancheStake} alt=""/>Slice</span></h2>
            </RewardsAmountCard>
          </RewardsAmountCardsWrapper>
        </RewardsAmountWrapper>   

        <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => setCurrentStep('withdraw')}>
        {i18n.t('claim')}
        </StakeModalFormBtn>
        {/* <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => setCurrentStep('withdraw')}>
          <LoadingButton>
            {
              [...Array(4).keys()].map((idx) =>{
                return <LoadingButtonCircle i={idx+1}></LoadingButtonCircle>
              })
            }
          </LoadingButton>
        </StakeModalFormBtn> */}
        
      </StakingMigrateModalContent>
    )
  }
  const migrateWithdraw = () =>{
    return(
      <StakingMigrateModalContent>

        <RewardsAmountWrapper MigrateContentTitle={ModeThemes[theme].MigrateContentTitle}>  
          <h2>{i18n.t('WithdrawSlice')}</h2>
          <RewardsAmountCardsWrapper>
            <RewardsAmountCard MigrateClaimCardBackground={ModeThemes[theme].MigrateClaimCardBackground} MigrateClaimCardTitle={ModeThemes[theme].MigrateClaimCardTitle} MigrateClaimCardValue={ModeThemes[theme].MigrateClaimCardValue}>
              <h2>{i18n.t('TotalSliceWithdraw')}</h2>
              <h2>1000<span><img src={TrancheStake} alt=""/>Slice</span></h2>
            </RewardsAmountCard>
          </RewardsAmountCardsWrapper>
        </RewardsAmountWrapper>   

        <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => setCurrentStep('stake')}>
          Withdraw
        </StakeModalFormBtn>
      </StakingMigrateModalContent>
    )
  }

  const migrateStakeSkip = () =>{
    return(
      <StakingMigrateModalContentWrapper>
        { objId === null ?
        <StakingMigrateModalContent>

          <StakeNewWrapper MigrateContentTitle={ModeThemes[theme].MigrateContentTitle}>
            <h2>{i18n.t('stakeNew')}</h2>

            <StakeNewTable>
              <StakeNewTableHead>
                <StakeNewCol head pool color={ModeThemes[theme].TableHead} ><h2>{i18n.t('stakingPool')}</h2></StakeNewCol>
                <StakeNewCol head lockup color={ModeThemes[theme].TableHead} ><h2>{i18n.t('lockup')}</h2></StakeNewCol>
                <StakeNewCol head apy color={ModeThemes[theme].TableHead} ><h2>apy</h2></StakeNewCol>
                <StakeNewCol head stake color={ModeThemes[theme].TableHead} ><h2>stake</h2></StakeNewCol>
              </StakeNewTableHead>
              <StakeNewTableCards>
                {
                  (data.sliceStakingList.length > 0 && data.sliceStakingList[0]) && data.sliceStakingList.map((staking, i) => 
                  <StakeNewTableCard
                    color={ModeThemes[theme].TableCard}
                    borderColor={ModeThemes[theme].TableCardBorderColor}
                    key={i}
                  >
                    <StakeNewCol pool>

                      <StakeNewColFirst>
                        <StakeNewColImg>
                          <img src={TrancheStake} alt=""/>
                        </StakeNewColImg>
                        <StakeNewColText color={ModeThemes[theme].tableText}>
                          <h2>{staking.type}</h2>
                          <h2>{addrShortener(staking.contractAddress)}</h2>
                        </StakeNewColText>
                      </StakeNewColFirst>

                    </StakeNewCol>

                    <StakeNewCol lockupValue lockup
                      docsLockupText={ModeThemes[theme].docsLockupText}
                      docsLockupBackground={ModeThemes[theme].docsLockupBackground}
                    >
                      <h2><span>{formatTime(staking.duration)}</span></h2>
                    </StakeNewCol>

                    <StakeNewCol apyValue apy color={ModeThemes[theme].tableText}>
                      <h2>{staking.apy}%</h2>
                    </StakeNewCol>

                    <StakeNewCol stake stakeValue>
                      <button onClick={() => setObjId(i)}>stake</button>
                    </StakeNewCol>


                  </StakeNewTableCard>
                  )
                }

                
              </StakeNewTableCards>
              </StakeNewTable>
          </StakeNewWrapper>

          <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => setCurrentStep('done')}>
            {i18n.t('skipFor')}
          </StakeModalFormBtn>
        </StakingMigrateModalContent> :
        
        <MigrateForm id={objId} />
        }

      </StakingMigrateModalContentWrapper>
    )
  }
  const MigrateForm = ({ id }) =>{
    return(
      <StakingMigrateModalContent>
        <SliceMigratedWrapper migrate>
          <StakingModalContentSideHeader BoxColor={ModeThemes[theme].BoxColor}>
            <StakingModalContentSideHeaderImg stake>
              <img src={TrancheStake} alt='img' />
            </StakingModalContentSideHeaderImg>
            <StakingModalContentSideHeaderText boxText={ModeThemes[theme].boxText} textColor={ModeThemes[theme].ModalText}>
              <h2>{data.sliceStakingList[id].type} STAKING POOL</h2>
              <h2>{data.sliceStakingList[id].contractAddress}</h2>
            </StakingModalContentSideHeaderText>
            <StakingModalChangeBtn onClick={() => setObjId(null)}>
              Change
            </StakingModalChangeBtn>
          </StakingModalContentSideHeader>
          <StakingModalContentSideHeaderBoxWrapper migrate>
            <StakingModalContentSideHeaderBox
              stake
              BoxColor={ModeThemes[theme].BoxColor}
              textColor={ModeThemes[theme].ModalText}
              BoxColorText={ModeThemes[theme].BoxColorText}
            >
              <h2>{i18n.t('lockup')}</h2>
              <h2>{formatTime(data.sliceStakingList[id].duration)}</h2>
            </StakingModalContentSideHeaderBox>
            <StakingModalContentSideHeaderBox
              stake
              BoxColor={ModeThemes[theme].BoxColor}
              textColor={ModeThemes[theme].ModalText}
              BoxColorText={ModeThemes[theme].BoxColorText}
            >
              <h2>APY</h2>
              <h2>{roundNumber(data.sliceStakingList[id].apy, false)}%</h2>
            </StakingModalContentSideHeaderBox>
            <StakingModalContentSideHeaderBox
              BoxColor={ModeThemes[theme].BoxColor}
              textColor={ModeThemes[theme].ModalText}
              BoxColorText={ModeThemes[theme].BoxColorText}
            >
              <h2>Pool Capacity</h2>
              <h2>{roundNumber(data.sliceStakingList[id].reward, false)} SLICE</h2>
            </StakingModalContentSideHeaderBox>
          </StakingModalContentSideHeaderBoxWrapper>

          <StakingForm 
            modalTypeVar="staking" 
            type={data.sliceStakingList[id].type} tokenAddress={data.sliceStakingList[id].tokenAddress}
            stakingAddress={stakingAddress}
            hasAllowance={hasAllowance}
            approveLoading={approveLoading}
            stakingApproveContract={stakingApproveContract}
            adjustStake={adjustStake}
            migrate={true}
          />
          
        </SliceMigratedWrapper>
        {/* <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => closeModalMigrate()}>
        {i18n.t('close')}
        </StakeModalFormBtn> */}
      </StakingMigrateModalContent>
    )
  }

  const migrateDone = () =>{
    return(
      <StakingMigrateModalContent>
        <SliceMigratedWrapper>
          <img src={Migrated} alt="" />
          <SliceMigratedText MigrateContentTitle={ModeThemes[theme].MigrateContentTitle} CongratsText={ModeThemes[theme].CongratsText}>
            <h2>{i18n.t('congrats')}</h2>
            <h2>{i18n.t('tokenMigrated')}</h2>
          </SliceMigratedText>
        </SliceMigratedWrapper>
        <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => closeModalMigrate()}>
        {i18n.t('close')}
        </StakeModalFormBtn>
      </StakingMigrateModalContent>
    )
  }

  return modalType === 'claim'
    ? claimModal()
    : modalType === 'staking'
    ? stakingModal()
    : modalTypeVar === 'liqStake' || modalTypeVar === 'liqWithdraw'
    ? liquidityModal()
    : modalType === 'withdrawTokens'
    ? migrateStake()
    : notFound();
};

StakingModal.propTypes = {
  ethereum: PropTypes.object.isRequired,
  summaryData: PropTypes.object.isRequired,
  stakingList: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  summaryData: state.summaryData,
  stakingList: state.data.stakingList,
  path: state.path,
  data: state.data,
  theme: state.theme
});

export default connect(mapStateToProps, {})(StakingModal);
