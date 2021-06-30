import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import StakingForm from '../Form/Staking';
import { ModeThemes, serverUrl, apiUri, SLICEAddress, LiquidityIcons } from 'config';
import { getUserStaked, claimRewards, addStake, withdrawStake } from 'services/contractMethods';
import useAnalytics from 'services/analytics';
import { setMigrateStep } from 'redux/actions/tableData';
import { CloseModal, CloseModalWhite, Lock, LockLight, TrancheStake, Migrated } from 'assets';
import { addrShortener, roundNumber, formatTime, isEqualTo } from 'utils';
import 'react-confirm-alert/src/react-confirm-alert.css';
import i18n from '../locale/i18n';

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
  StakeModalFormBtn,
  SliceNotFound,
  SliceNotFoundBtn,
  ModalHeader,
  StakingModalHeader,
  StepProgressBarWrapper,
  ProgressBarStep,
  ProgressBarLineWrapper,
  ProgressBarDashedLine,
  ProgressBarLine,
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
import ProgressBar from '../Stake/ProgressBar/ProgressBar';
import CountdownWrapper from '../Stake/ProgressBar/Countdown';

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
  data: { stakingList, sliceStakingList, userStakingList, currentStep, hasMigrated },
  summaryData: { accruedRewards, totalAccruedRewards },
  theme,
  setMigrateStep,
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
  const [migrateLoading, setMigrateLoading] = useState(false);
  const { slice, lp } = userStakingList;
  const newSliceRewards = slice.filter(s => s.duration).reduce((acc, cur) => acc + cur.reward, 0)
  
  const fullStakingList = sliceStakingList.concat(stakingList);
  const apiMapping = fullStakingList.reduce((acc, cur) => {
    if (!cur) return acc;
    const { duration, poolName, contractAddress, type } = cur;
    if (duration) {
      acc[duration] = poolName;
    } else if (type !== 'SLICE') {
      acc[contractAddress] = type;
    }
    return acc;
  }, {});

  useEffect(() => {
    let stakes = [];
    const withDuration = slice.filter(s => s.duration);
    const withoutDuration = sliceStakingList.filter(s => !s.duration);
    setNewSlice(sliceStakingList.filter(s => s.duration));
    setOldSlice(withoutDuration);

    if (modalType === 'claim') {
      stakes = hasMigrated ? withDuration : withDuration.concat(withoutDuration);
    } else {
      if (tokenAddress === SLICEAddress) {
        stakes = duration ? withDuration : withoutDuration;
      } else {
        const lpStake = lp.find(o => o.tokenAddress === tokenAddress);
        stakes = lpStake ? [ lpStake ] : [];
      }
    }
    setUserStakes(stakes)
  }, [modalType, duration, lp, slice, sliceStakingList, tokenAddress]);

  useEffect(() => {
    setModalTypeVar(modalType);
  }, [modalType]);

  useEffect(() => {
    if (modalType === 'withdrawTokens' && address) {
      if (accruedRewards && isEqualTo(accruedRewards[SLICEAddress], 0)) setMigrateStep('withdraw');
      if (sliceStakingList[sliceStakingList.length - 1] && isEqualTo(sliceStakingList[sliceStakingList.length - 1].subscription, 0)) setMigrateStep('stake');
    }
  }, [modalType, address, accruedRewards, sliceStakingList, setMigrateStep])

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

  const adjustStake = async (e, contractAddress, tokenAddress, durationIndex = false, migrate) => {
    try {
      e.preventDefault();
      migrate && setMigrateLoading(true)
      if (modalType !== 'liqWithdraw') {
        if (migrate) {
          await addStake(contractAddress, tokenAddress, durationIndex);
          setMigrateLoading(false);
        } 
        addStake(contractAddress, tokenAddress, durationIndex)
      } else {
        withdrawStake(contractAddress, tokenAddress);
      }

      modalType === 'liqStake'
        ? Tracker('addStake', 'User address: ' + address)
        : modalType === 'staking' 
        ? Tracker('addLockup', 'User address: ' + address)
        : Tracker('withdrawStake', 'User address: ' + address);
      migrate ? setMigrateStep('done') : closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const claimAndProgress = async (claimType) => {
    try {
      setMigrateLoading(true)
      if (claimType === 'rewards') await claimRewards(oldSlice[0].yieldAddress, undefined, true);
      if (claimType === 'oldStake') await withdrawStake(oldSlice[0].contractAddress, oldSlice[0].tokenAddress, true, true);
      setMigrateLoading(false)

      if (claimType === 'skip') setMigrateStep('done');
    } catch (error) {
      console.log(error)
    }
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
                {totalAccruedRewards && roundNumber(totalAccruedRewards + newSliceRewards) !== 'NaN' ? roundNumber(totalAccruedRewards + newSliceRewards) : '0'} SLICE <span>(Current Value is $Need from API)</span>
              </h2>
            </ClaimModalHeader>
            <ClaimModalTableWrapper
             scroll={userStakes.filter(stake => stake.tokenAddress === SLICEAddress).length >= 3}
            >
              <ClaimModalTableTitle textColor={ModeThemes[theme].ModalText}>
                <h2>SLICE Pools</h2>
              </ClaimModalTableTitle>

              <ClaimModalTableHead BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol pair head sliceliquidityFirstLast TableHeadText={ModeThemes[theme].TableHeadText} mobilePair>
                  <h2>{i18n.t('pair')}</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText} mobileHide>
                  <h2>{i18n.t('depositDate')}</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText} mobileHide>
                  <h2>{i18n.t('endDate')}</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText} mobile>
                  <h2>Total Locked</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText} mobile>
                  <h2>Rewards</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceliquidityFirstLast manage TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Manage</h2>
                </ClaimModalTableCol>
              </ClaimModalTableHead>
              {
                userStakes.filter(stake => stake.tokenAddress === SLICEAddress).map((stake, index) => {
                  return (
                    <ClaimModalTableRow key={index} BorderStake={ModeThemes[theme].BorderStake}>
                      <ClaimModalTableCol pair col sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText} mobilePair scroll={userStakes.filter(stake => stake.tokenAddress === SLICEAddress).length >= 3} slice>  
                        <div>
                          <img src={TrancheStake} alt='Tranche' />
                        </div>
                        <h2>{stake.duration ? apiMapping[stake.duration] : 'Slice'}</h2>
                      </ClaimModalTableCol>

                      <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText} mobileHide>
                        <h2>{ stake.startTime ? moment.unix(stake.startTime).format('MMM DD YYYY'): 'N/A'}</h2>
                      </ClaimModalTableCol>
                      <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText} mobileHide>
                        <h2>{ stake.endTime ? moment.unix(stake.endTime).format('MMM DD YYYY'): 'N/A'}</h2>
                      </ClaimModalTableCol>
                      <ClaimModalTableCol col sliceCol staked textColor={ModeThemes[theme].ModalText} mobile>
                        <h2>
                          <img src={Lock} alt='lock' /> {stake.duration ? roundNumber(stake.deposit) : roundNumber(sliceStakingList[sliceStakingList.length - 1].subscription)}
                        </h2>
                      </ClaimModalTableCol>
                      <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText} mobile>
                        <h2>{stake.duration ? roundNumber(stake.reward) : accruedRewards ? roundNumber(accruedRewards[stake.tokenAddress]) : 0} SLICE</h2>
                      </ClaimModalTableCol>

                      <ClaimModalTableCol col sliceliquidityFirstLast>
                        <ClaimModalTableBtn onClick={() => stake.duration ? claimRewards(stake.contractAddress, stake.stakingCounter) : openModal('withdrawTokens')} disabled={stake.duration && (stake.endTime > moment().unix())}>{stake.duration ? 'Claim' : 'Migrate'}
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
                <CountdownWrapper modal theme={theme} />
              </ClaimModalTableSubTitle>

              <ProgressBar width='100' colorOne='rgba(160, 160, 160, 0.15)' colorTwo='#369987' />

              <ClaimModalTableHead BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol pair head sliceliquidityFirstLast TableHeadText={ModeThemes[theme].TableHeadText} mobilePair>
                  <h2>Pair</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head liquidityCol TableHeadText={ModeThemes[theme].TableHeadText} mobile>
                  <h2>Total Staked</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head liquidityCol TableHeadText={ModeThemes[theme].TableHeadText} mobile>
                  <h2>Rewards</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceliquidityFirstLast manage TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Manage</h2>
                </ClaimModalTableCol>
              </ClaimModalTableHead>

              {stakingList.map((lp, index) => {
                return (
                  <ClaimModalTableRow key={index} BorderStake={ModeThemes[theme].BorderStake}>
                    <ClaimModalTableCol pair col sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText} mobilePair> 
                      <div>
                        <img src={TrancheStake} alt='Tranche' />
                        <img src={LiquidityIcons[apiMapping[lp.contractAddress]]} alt='Tranche' />
                      </div>
                      <h2>{apiMapping[lp.contractAddress].split(' ')[0]}</h2>
                    </ClaimModalTableCol>

                    <ClaimModalTableCol col liquidityCol staked textColor={ModeThemes[theme].ModalText} mobile>
                      <h2>
                        <img src={Lock} alt='lock' /> {roundNumber(lp.subscription)}
                      </h2>
                    </ClaimModalTableCol>
                    <ClaimModalTableCol col liquidityCol textColor={ModeThemes[theme].ModalText} mobile> 
                      <h2>{accruedRewards ? roundNumber(accruedRewards[lp.tokenAddress]) : '0'} SLICE</h2>
                    </ClaimModalTableCol>

                    <ClaimModalTableCol col sliceliquidityFirstLast>
                      <ClaimModalTableBtn onClick={() => claimRewards(lp.yieldAddress, undefined)}>Claim</ClaimModalTableBtn>
                    </ClaimModalTableCol>
                  </ClaimModalTableRow>
                )
              }) }
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
                    <h2>{formatTime(duration)}</h2>
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
                    <h2>Remaining Capacity</h2>
                    <h2>{roundNumber(remainingCap, false)} SLICE</h2>
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
                {
                  userStakes.filter(s => {
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
                  type={type} 
                  tokenAddress={tokenAddress}
                  contractAddress={contractAddress}
                  durationIndex={durationIndex}
                  userStaked={userStaked}
                  adjustStake={() => adjustStake()}
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
                    <h2>{roundNumber(reward, false)} SLICE</h2>
                  </StakingModalContentSideHeaderBox>
                </StakingModalContentSideHeaderBoxWrapper>

                <StakeModalPoolTable>
                  <StakeModalPoolTableTitle textColor={ModeThemes[theme].ModalText}>
                    <h2>{i18n.t('yourStakes')}</h2>
                  </StakeModalPoolTableTitle>
                  <StakeModalPoolTableHead>
                    <StakeModalPoolTableCol head TableHeadText={ModeThemes[theme].TableHeadText}>
                      <h2>STAKED AMOUNT</h2>
                    </StakeModalPoolTableCol>
                    <StakeModalPoolTableCol head TableHeadText={ModeThemes[theme].TableHeadText}>
                      <h2>TOTAL STAKED</h2>
                    </StakeModalPoolTableCol>
                    <StakeModalPoolTableCol head TableHeadText={ModeThemes[theme].TableHeadText}>
                      <h2>YOUR SHARE</h2>
                    </StakeModalPoolTableCol>
                  </StakeModalPoolTableHead>
                </StakeModalPoolTable>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                    <h2>{roundNumber(userStaked)}</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                    <h2>{roundNumber(totalStaked)}</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                    <h2>{roundNumber(stakedShare, 2)}</h2>
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
                  userStaked={userStaked}
                  adjustStake={() => adjustStake()}
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
                  <button onClick={closeModal}>
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
              <h2>{accruedRewards ? roundNumber(accruedRewards[oldSlice[0].tokenAddress]) : 0}<span><img src={TrancheStake} alt=""/>Slice</span></h2>
            </RewardsAmountCard>
          </RewardsAmountCardsWrapper>
        </RewardsAmountWrapper>   
      {!migrateLoading ?
        <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => claimAndProgress('rewards')}>
              {i18n.t('claim')}
        </StakeModalFormBtn> :
        <StakeModalFormBtn migrate step={currentStep} migrateStake>
          <LoadingButton>
            {
              [...Array(4).keys()].map((idx) =>{
                return <LoadingButtonCircle i={idx+1}></LoadingButtonCircle>
              })
            }
          </LoadingButton>
        </StakeModalFormBtn>
      }
        
        
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
              <h2>{roundNumber(oldSlice[0].subscription)}<span><img src={TrancheStake} alt=""/>Slice</span></h2>
            </RewardsAmountCard>
          </RewardsAmountCardsWrapper>
        </RewardsAmountWrapper>   

        {!migrateLoading ?

        <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => claimAndProgress('oldStake')}>
          Withdraw
        </StakeModalFormBtn> : 
        <StakeModalFormBtn migrate step={currentStep} migrateStake>
          <LoadingButton>
            {
              [...Array(4).keys()].map((idx) =>{
                return <LoadingButtonCircle i={idx+1}></LoadingButtonCircle>
              })
            }
          </LoadingButton>
        </StakeModalFormBtn>
        }
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
                  newSlice.map((stakingPool, i) => 
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
                          <h2>{stakingPool.poolName}</h2>
                          <h2>{addrShortener(stakingPool.contractAddress)}</h2>
                        </StakeNewColText>
                      </StakeNewColFirst>

                    </StakeNewCol>

                    <StakeNewCol lockupValue lockup
                      docsLockupText={ModeThemes[theme].docsLockupText}
                      docsLockupBackground={ModeThemes[theme].docsLockupBackground}
                    >
                      <h2><span>{formatTime(stakingPool.duration)}</span></h2>
                    </StakeNewCol>

                    <StakeNewCol apyValue apy color={ModeThemes[theme].tableText}>
                      <h2>{stakingPool.apy}%</h2>
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

          <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => claimAndProgress('skip')}>
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
              <h2>{sliceStakingList[id].poolName} STAKING POOL</h2>
              <h2>{sliceStakingList[id].contractAddress}</h2>
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
              <h2>{formatTime(sliceStakingList[id].duration)}</h2>
            </StakingModalContentSideHeaderBox>
            <StakingModalContentSideHeaderBox
              stake
              BoxColor={ModeThemes[theme].BoxColor}
              textColor={ModeThemes[theme].ModalText}
              BoxColorText={ModeThemes[theme].BoxColorText}
            >
              <h2>APY</h2>
              <h2>{roundNumber(sliceStakingList[id].apy, false)}%</h2>
            </StakingModalContentSideHeaderBox>
            <StakingModalContentSideHeaderBox
              BoxColor={ModeThemes[theme].BoxColor}
              textColor={ModeThemes[theme].ModalText}
              BoxColorText={ModeThemes[theme].BoxColorText}
            >
              <h2>Remaining Capacity</h2>
              <h2>{roundNumber(sliceStakingList[id].reward, false)} SLICE</h2>
            </StakingModalContentSideHeaderBox>
          </StakingModalContentSideHeaderBoxWrapper>

          <StakingForm 
            modalTypeVar="staking" 
            type={sliceStakingList[id].type} 
            tokenAddress={sliceStakingList[id].tokenAddress}
            contractAddress={sliceStakingList[id].contractAddress}
            durationIndex={sliceStakingList[id].durationIndex}
            userStaked={userStaked}
            adjustStake={() => adjustStake()}
            migrate={true}
            migrateLoading={migrateLoading}
          />
          
        </SliceMigratedWrapper>
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
        <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => closeModal()}>
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

export default connect(mapStateToProps, { setMigrateStep })(StakingModal);
