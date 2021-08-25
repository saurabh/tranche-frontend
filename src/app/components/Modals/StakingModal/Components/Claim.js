import React from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import { ModeThemes, LiquidityIcons, SLICEAddress } from 'config';
import { roundNumber, safeMultiply } from 'utils';
import { claimRewards } from 'services/contractMethods';
import i18n from 'app/components/locale/i18n';
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
  FirstCustomStyles
} from '../../styles/ModalsComponents';
import { CloseModal, CloseModalWhite, TrancheStake, Lock } from 'assets';
import ProgressBar from 'app/components/Stake/ProgressBar/ProgressBar';
import CountdownWrapper from 'app/components/Stake/ProgressBar/Countdown';

export const claimModal = ({
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
}) => {
  const newSliceRewards = slice.filter((s) => s.duration).reduce((acc, cur) => acc + cur.reward, 0);

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
              {totalAccruedRewards && roundNumber(totalAccruedRewards + newSliceRewards) !== 'NaN'
                ? roundNumber(totalAccruedRewards + newSliceRewards)
                : '0'}{' '}
              SLICE{' '}
              <span>
                (Current Value is $
                {exchangeRates && roundNumber(safeMultiply(totalAccruedRewards + newSliceRewards, exchangeRates.SLICE)) !== 'NaN'
                  ? roundNumber(safeMultiply(totalAccruedRewards + newSliceRewards, exchangeRates.SLICE))
                  : 0}
                )
              </span>
            </h2>
          </ClaimModalHeader>
          <ClaimModalTableWrapper scroll={userStakes.filter((stake) => stake.tokenAddress === SLICEAddress).length >= 3}>
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
            {userStakes
              .filter((stake) => stake.tokenAddress === SLICEAddress)
              .map((stake, index) => {
                return (
                  <ClaimModalTableRow key={index} BorderStake={ModeThemes[theme].BorderStake}>
                    <ClaimModalTableCol
                      pair
                      col
                      sliceliquidityFirstLast
                      textColor={ModeThemes[theme].ModalText}
                      mobilePair
                      scroll={userStakes.filter((stake) => stake.tokenAddress === SLICEAddress).length >= 3}
                      slice
                    >
                      <div>
                        <img src={TrancheStake} alt='Tranche' />
                      </div>
                      <h2>{stake.duration ? apiMapping[stake.duration] : 'Slice'}</h2>
                    </ClaimModalTableCol>

                    <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText} mobileHide>
                      <h2>{stake.startTime ? moment.unix(stake.startTime).format('MMM DD YYYY') : 'N/A'}</h2>
                    </ClaimModalTableCol>
                    <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText} mobileHide>
                      <h2>{stake.endTime ? moment.unix(stake.endTime).format('MMM DD YYYY') : 'N/A'}</h2>
                    </ClaimModalTableCol>
                    <ClaimModalTableCol col sliceCol staked textColor={ModeThemes[theme].ModalText} mobile>
                      <h2>
                        <img src={Lock} alt='lock' />{' '}
                        {stake.duration ? roundNumber(stake.deposit) : roundNumber(sliceStakingList[sliceStakingList.length - 1].subscription)}
                      </h2>
                    </ClaimModalTableCol>
                    <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText} mobile>
                      <h2>
                        {stake.duration ? roundNumber(stake.reward) : accruedRewards ? roundNumber(accruedRewards[stake.tokenAddress]) : 0} SLICE
                      </h2>
                    </ClaimModalTableCol>

                    <ClaimModalTableCol col sliceliquidityFirstLast>
                      <ClaimModalTableBtn
                        disabledBtnColor={ModeThemes[theme].disabledBtnColor}
                        onClick={() => (stake.duration ? claimRewards(stake.contractAddress, stake.stakingCounter) : openModal('withdrawTokens'))}
                        disabled={stake.duration && stake.endTime > moment().unix()}
                      >
                        {stake.duration ? 'Claim' : 'Migrate'}
                      </ClaimModalTableBtn>
                    </ClaimModalTableCol>
                  </ClaimModalTableRow>
                );
              })}
          </ClaimModalTableWrapper>
          <ClaimModalTableWrapper>
            <ClaimModalTableTitle textColor={ModeThemes[theme].ModalText}>
              <h2>Liquidity Provider Pools</h2>
            </ClaimModalTableTitle>
            <ClaimModalTableSubTitle textColor={ModeThemes[theme].ModalText}>
              <h2>Next Liquidity Provider Pool Distribution</h2>
              <CountdownWrapper modal theme={theme} />
            </ClaimModalTableSubTitle>

            <ProgressBar width='100' colorOne='rgba(160, 160, 160, 0.15)' colorTwo='#369987' />

            <ClaimModalTableHead BorderStake={ModeThemes[theme].BorderStake}>
              <ClaimModalTableCol pair head sliceliquidityFirstLast TableHeadText={ModeThemes[theme].TableHeadText} mobilePair>
                <h2>Pair</h2>
              </ClaimModalTableCol>
              <ClaimModalTableCol head liquidityCol TableHeadText={ModeThemes[theme].TableHeadText} mobile>
                <h2>Your Stake</h2>
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
              );
            })}
          </ClaimModalTableWrapper>
        </StakingModalContent>
      </StakingModalContentWrapper>
    </Modal>
  );
};
