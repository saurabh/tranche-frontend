import React from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import { ModeThemes, SLICEAddress } from 'config';
import { roundNumber, formatTime } from 'utils';
import StakingForm from 'app/components/Form/Staking';
import i18n from 'app/components/locale/i18n';
import {
  StakingModalContentWrapper,
  StakingModalContent,
  StakingModalClose,
  StakeModalPoolTable,
  StakeModalPoolTableTitle,
  StakeModalPoolTableHead,
  StakeModalPoolTableRow,
  StakeModalPoolTableCol,
  StakingModalContentSideWrapper,
  StakingModalContentSide,
  BreakLink,
  stakingModalStyles,
  StakingModalContentSideTitle,
  StakingModalContentSideHeader,
  StakingModalContentSideHeaderBoxWrapper,
  StakingModalContentSideHeaderBox,
  StakingModalContentSideHeaderImg,
  StakingModalContentSideHeaderText,
} from '../../styles/ModalsComponents';
import { CloseModal, CloseModalWhite, TrancheStake, LockLight } from 'assets';

export const stakingModal = ({
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
}) => {
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

              <StakeModalPoolTable
                scroll={
                  userStakes.filter((s) => {
                    return (
                      s.contractAddress === contractAddress &&
                      s.tokenAddress === tokenAddress &&
                      (tokenAddress !== SLICEAddress || !s.duration || s.durationIndex === durationIndex)
                    );
                  }).length >= 3
                }
              >
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

                {userStakes
                  .filter((s) => {
                    return (
                      s.contractAddress === contractAddress &&
                      s.tokenAddress === tokenAddress &&
                      (tokenAddress !== SLICEAddress || !s.duration || s.durationIndex === durationIndex)
                    );
                  })
                  .map((s) => {
                    return (
                      <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                        <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                          <h2>{s.startTime ? moment.unix(s.startTime).format('MMM DD YYYY') : 'N/A'}</h2>
                        </StakeModalPoolTableCol>
                        <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                          <h2>{s.endTime ? moment.unix(s.endTime).format('MMM DD YYYY') : 'N/A'}</h2>
                        </StakeModalPoolTableCol>
                        <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                          <h2>
                            <img src={LockLight} alt='img' />
                            {s.deposit} SLICE
                          </h2>
                        </StakeModalPoolTableCol>
                      </StakeModalPoolTableRow>
                    );
                  })}
              </StakeModalPoolTable>
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
                apy={apy}
                duration={duration}
                userStaked={userStaked}
                adjustStake={adjustStake}
              />
            </StakingModalContentSide>
          </StakingModalContentSideWrapper>
        </StakingModalContent>
      </StakingModalContentWrapper>
    </Modal>
  );
};
