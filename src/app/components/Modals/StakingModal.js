import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import StakingForm from '../Form/Staking';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal, CloseModalWhite, ETHCARD, Lock, LockLight, TrancheIcon, TrancheStake, Migrated } from 'assets';
import { roundNumber } from 'utils';
import * as moment from 'moment';
import {
  SLICEAddress
} from 'config/constants';
import { getUserStaked } from 'services/contractMethods';

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
  SliceMigratedText
} from './styles/ModalsComponents';
import { Countdown } from '../Stake/Header/styles/HeaderComponents';
import ProgressBar from '../Stake/ProgressBar/ProgressBar';
import { ModeThemes, serverUrl, apiUri } from 'config';
import i18n from '../locale/i18n';
import { LiquidityIcons } from 'config';

const { stakingSummaryDetail } = apiUri;

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
  // Redux
  ethereum: { address },
  theme,
  // State Values
  modalIsOpen,
  type,
  modalType,
  contractAddress,
  tokenAddress,
  title,
  rewards,
  timerData,
  apy,
  userStakingList,
  durationIndex,
  progress,
  duration,
  hasAllowance,
  approveLoading,
  sliceStakingList,
  // Functions
  stakingApproveContract,
  adjustStake,
  closeModal
  // API Values,
}) => {
  const [modalTypeVar, setModalTypeVar] = useState('');
  const [currentStep, setCurrentStep] = useState('claim');
  const [totalStaked, setTotalStaked] = useState(0);
  const [userStaked, setUserStaked] = useState(0);
  const [stakedShare, setStakedShare] = useState(0);
  
  const poolDurationMapping = sliceStakingList.reduce((acc, cur) => {
    const { duration, poolName } = cur;
    if (duration)
    {
      acc[ duration ] = poolName;
    }
    return acc;
  }, {});
  const { slice, lp } = userStakingList;

  let stakes = [];
  if (modalType === 'claim') {
    const withDuration = slice.filter(s => s.duration);
    const withoutDuration = slice.filter(s => !s.duration);
    stakes = withDuration.concat(withoutDuration);
  } else if(modalType === 'claim'){
    if (tokenAddress === SLICEAddress) {
      stakes = slice;
    } else {
      const lpStake = lp.find(o => o.tokenAddress === tokenAddress);
      stakes = lpStake ? [ lpStake ] : [];
    }
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

  useEffect(() => {
    const getStakingDetails = async () => {
      const res = await axios(`${serverUrl + stakingSummaryDetail + tokenAddress + '/' + address}`);
      const { result } = res.data;
      setTotalStaked(result.staked);
      let userStaked = await getUserStaked(contractAddress, tokenAddress);
      setUserStaked(userStaked);
      setStakedShare((parseFloat(result.userStaked) / result.staked) * 100);
    };

    modalIsOpen && !duration && tokenAddress && getStakingDetails();
  }, [modalIsOpen, type, duration, tokenAddress, contractAddress, address]);

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
                  <h2>Pair</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Deposit Date</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>End Date</h2>
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
              {
                stakes.map((stake, index) => {
                  return (
                    <ClaimModalTableRow key={index} BorderStake={ModeThemes[theme].BorderStake}>
                      <ClaimModalTableCol pair col sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText}>
                        <div>
                          <img src={ETHCARD} alt='img' />
                          <img src={ETHCARD} alt='img' />
                        </div>
                        <h2>{stake.duration ? poolDurationMapping[stake.duration] : 'Slice'}</h2>
                      </ClaimModalTableCol>

                      <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                        <h2>{ stake.startTime ? moment.unix(stake.startTime).format('MMM DD YYYY'): 'N/A'}</h2>
                      </ClaimModalTableCol>
                      <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                        <h2>{ stake.endTime ? moment.unix(stake.endTime).format('MMM DD YYYY'): 'N/A'}</h2>
                      </ClaimModalTableCol>
                      <ClaimModalTableCol col sliceCol staked textColor={ModeThemes[theme].ModalText}>
                        <h2>
                          <img src={Lock} alt='lock' /> {roundNumber(stake.deposit)}
                        </h2>
                      </ClaimModalTableCol>
                      <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                        <h2>{roundNumber(stake.reward)} SLICE</h2>
                      </ClaimModalTableCol>

                      <ClaimModalTableCol col sliceliquidityFirstLast>
                        <ClaimModalTableBtn onClick={(e) => {
                          console.log(e);
                        }} disabled={stake.duration && (stake.endTime > moment().unix())}>{stake.duration ? 'Claim' : 'Migrate'}
                        </ClaimModalTableBtn>
                      </ClaimModalTableCol>
                    </ClaimModalTableRow>

                  )
                })
              }

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
                  <h2>Deposit Date</h2>
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
                  <ClaimModalTableBtn>Claim</ClaimModalTableBtn>
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
                  <ClaimModalTableBtn>Claim</ClaimModalTableBtn>
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
                  <h2>Pool Info</h2>
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
                    <h2>Lockup</h2>
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
                    <h2>Your Stakes in this Pool</h2>
                  </StakeModalPoolTableTitle>
                  <StakeModalPoolTableHead>
                    <StakeModalPoolTableCol head stake TableHeadText={ModeThemes[theme].TableHeadText}>
                      <h2>Deposit date</h2>
                    </StakeModalPoolTableCol>
                    <StakeModalPoolTableCol head stake TableHeadText={ModeThemes[theme].TableHeadText}>
                      <h2>End date</h2>
                    </StakeModalPoolTableCol>
                    <StakeModalPoolTableCol head stake TableHeadText={ModeThemes[theme].TableHeadText}>
                      <h2>total locked</h2>
                    </StakeModalPoolTableCol>
                  </StakeModalPoolTableHead>
                </StakeModalPoolTable>
                {
                  stakes.filter(s => {
                    return s.contractAddress === contractAddress
                      && s.tokenAddress === tokenAddress
                      && (tokenAddress !== SLICEAddress || !s.duration || s.durationIndex === durationIndex)
                  }).map(s => {
                    return (
                      <StakeModalPoolTableRow BorderStake={ModeThemes[ theme ].BorderStake}>
                      <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                        <h2>{ s.startTime ? moment.unix(s.startTime).format('MMM DD YYYY') : 'N/A'}</h2>
                      </StakeModalPoolTableCol>
                      <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                        <h2>{ s.endTime ? moment.unix(s.endTime).format('MMM DD YYYY') : 'N/A'}</h2>
                      </StakeModalPoolTableCol>
                      <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                        <h2>
                          <img src={LockLight} alt='img' />
                          {s.deposit} SLICE
                        </h2>
                      </StakeModalPoolTableCol>
                      </StakeModalPoolTableRow>
                    )
                  })
                }
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
                  contractAddress={contractAddress}
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
                    <h2>Your Stakes in this Pool</h2>
                  </StakeModalPoolTableTitle>
                  <StakeModalPoolTableHead>
                    <StakeModalPoolTableCol head TableHeadText={ModeThemes[theme].TableHeadText}>
                      <h2>Deposit date</h2>
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
                  type={type} 
                  tokenAddress={tokenAddress}
                  contractAddress={contractAddress}
                  hasAllowance={hasAllowance}
                  userStaked={userStaked}
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
                  <h2>Claim</h2>
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
                <h2>Claim Your Rewards from SLICE Pools</h2>
                <RewardsAmountCardsWrapper>
                  <RewardsAmountCard MigrateClaimCardBackground={ModeThemes[theme].MigrateClaimCardBackground} MigrateClaimCardTitle={ModeThemes[theme].MigrateClaimCardTitle} MigrateClaimCardValue={ModeThemes[theme].MigrateClaimCardValue}>
                    <h2>Total Amount of SLICE Staked:</h2>
                    <h2>1000<span><img src={TrancheStake} alt=""/>Slice</span></h2>
                  </RewardsAmountCard>
        
                  <RewardsAmountCard MigrateClaimCardBackground={ModeThemes[theme].MigrateClaimCardBackground} MigrateClaimCardTitle={ModeThemes[theme].MigrateClaimCardTitle} MigrateClaimCardValue={ModeThemes[theme].MigrateClaimCardValue}>
                    <h2>Amount of SLICE Rewards to Claim:</h2>
                    <h2>1000<span><img src={TrancheStake} alt=""/>Slice</span></h2>
                  </RewardsAmountCard>
                </RewardsAmountCardsWrapper>
              </RewardsAmountWrapper>   

              <StakeModalFormBtn step={currentStep} migrateStake onClick={() => setCurrentStep('withdraw')}>
                Claim
              </StakeModalFormBtn>
            </StakingMigrateModalContent>
    )
  }
  const migrateWithdraw = () =>{
    return(
      <StakingMigrateModalContent>

        <RewardsAmountWrapper MigrateContentTitle={ModeThemes[theme].MigrateContentTitle}>  
          <h2>Withdraw SLICE from SLICE Pools</h2>
          <RewardsAmountCardsWrapper>
            <RewardsAmountCard MigrateClaimCardBackground={ModeThemes[theme].MigrateClaimCardBackground} MigrateClaimCardTitle={ModeThemes[theme].MigrateClaimCardTitle} MigrateClaimCardValue={ModeThemes[theme].MigrateClaimCardValue}>
              <h2>Total Amount of SLICE Available to Withdraw:</h2>
              <h2>1000<span><img src={TrancheStake} alt=""/>Slice</span></h2>
            </RewardsAmountCard>
          </RewardsAmountCardsWrapper>
        </RewardsAmountWrapper>   

        <StakeModalFormBtn step={currentStep} migrateStake onClick={() => setCurrentStep('stake')}>
          Withdraw
        </StakeModalFormBtn>
      </StakingMigrateModalContent>
    )
  }

  const migrateStakeSkip = () =>{
    return(
      <StakingMigrateModalContent>

        <StakeNewWrapper MigrateContentTitle={ModeThemes[theme].MigrateContentTitle}>
          <h2>Stake Into a New Pool</h2>

          <StakeNewTable>
            <StakeNewTableHead>
              <StakeNewCol head pool color={ModeThemes[theme].TableHead} ><h2>staking pool</h2></StakeNewCol>
              <StakeNewCol head lockup color={ModeThemes[theme].TableHead} ><h2>lockup</h2></StakeNewCol>
              <StakeNewCol head apy color={ModeThemes[theme].TableHead} ><h2>apy</h2></StakeNewCol>
              <StakeNewCol head stake color={ModeThemes[theme].TableHead} ><h2>stake</h2></StakeNewCol>
            </StakeNewTableHead>
            <StakeNewTableCards>
              <StakeNewTableCard
                color={ModeThemes[theme].TableCard}
                borderColor={ModeThemes[theme].TableCardBorderColor}
              >
                <StakeNewCol pool>

                  <StakeNewColFirst>
                    <StakeNewColImg>
                      <img src={TrancheStake} alt=""/>
                    </StakeNewColImg>
                    <StakeNewColText color={ModeThemes[theme].tableText}>
                      <h2>DIAMOND HANDS</h2>
                      <h2>0xb51....468</h2>
                    </StakeNewColText>
                  </StakeNewColFirst>

                </StakeNewCol>

                <StakeNewCol lockupValue lockup
                  docsLockupText={ModeThemes[theme].docsLockupText}
                  docsLockupBackground={ModeThemes[theme].docsLockupBackground}
                >
                  <h2><span>1 year</span></h2>
                </StakeNewCol>

                <StakeNewCol apyValue apy color={ModeThemes[theme].tableText}>
                  <h2>40%</h2>
                </StakeNewCol>

                <StakeNewCol stake stakeValue>
                  <button>stake</button>
                </StakeNewCol>


              </StakeNewTableCard>
            </StakeNewTableCards>
            </StakeNewTable>
        </StakeNewWrapper>

        <StakeModalFormBtn step={currentStep} migrateStake onClick={() => setCurrentStep('done')}>
          Skip For Now
        </StakeModalFormBtn>
      </StakingMigrateModalContent>
    )
  }

  const migrateDone = () =>{
    return(
      <StakingMigrateModalContent>
        <SliceMigratedWrapper>
          <img src={Migrated} alt="" />
          <SliceMigratedText MigrateContentTitle={ModeThemes[theme].MigrateContentTitle} CongratsText={ModeThemes[theme].CongratsText}>
            <h2>Congratulations</h2>
            <h2>Your SLICE tokens were migrated </h2>
          </SliceMigratedText>
        </SliceMigratedWrapper>
        <StakeModalFormBtn step={currentStep} migrateStake onClick={() => closeModalMigrate()}>
          Close
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
  sliceStakingList: state.data.sliceStakingList,
  userStakingList: state.data.userStakingList,
  path: state.path,
  theme: state.theme
});

export default connect(mapStateToProps, {})(StakingModal);
