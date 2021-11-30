import React from 'react';
import Modal from 'react-modal';
import { ModeThemes } from 'config';
import { addrShortener, roundNumber, formatTime } from 'utils';
import StakingForm from 'app/components/Form/Staking';
import i18n from 'app/components/locale/i18n';
import {
  StakingModalContentWrapper,
  StakingModalContent,
  StakingModalClose,
  StakingModalContentSideTitle,
  StakingModalContentSideHeader,
  StakingModalContentSideHeaderBoxWrapper,
  StakingModalContentSideHeaderBox,
  StakingModalContentSideHeaderImg,
  StakingModalContentSideHeaderText,
  StakeModalFormBtn,
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
  StakingMigrateModalContentWrapper,
  MigrateStake
} from '../../styles/ModalsComponents';
import { CloseModal, CloseModalWhite, TrancheStake, Migrated } from 'assets';

export const migrateStake = ({
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
}) => {
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
      <StakingModalContentWrapper height='457px' backgroundColor={ModeThemes[theme].ModalBackground} migrateStake skipStake>
        <StakingModalContent height='457px' textColor={ModeThemes[theme].ModalText} migrateStake skipStake>
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
                active
                done={currentStep === 'withdraw' || currentStep === 'stake' || currentStep === 'done'}
              >
                <span>1</span>
                <h2>{i18n.t('claim')}</h2>
              </ProgressBarStep>

              <ProgressBarLineWrapper lineOne>
                <ProgressBarDashedLine
                  MigrateProgressLine={ModeThemes[theme].MigrateProgressLine}
                  done={currentStep === 'withdraw' || currentStep === 'stake' || currentStep === 'done'}
                ></ProgressBarDashedLine>
                <ProgressBarLine
                  MigrateProgressLine={ModeThemes[theme].MigrateProgressLine}
                  done={currentStep === 'withdraw' || currentStep === 'stake' || currentStep === 'done'}
                ></ProgressBarLine>
              </ProgressBarLineWrapper>

              <ProgressBarStep
                MigrateProgressTextActive={ModeThemes[theme].MigrateProgressTextActive}
                MigrateProgressTextPending={ModeThemes[theme].MigrateProgressTextPending}
                MigrateStepBorder={ModeThemes[theme].MigrateStepBorder}
                MigrateStepTextPending={ModeThemes[theme].MigrateStepTextPending}
                MigrateStepText={ModeThemes[theme].MigrateStepText}
                Withdraw
                active={currentStep === 'withdraw'}
                done={currentStep === 'stake' || currentStep === 'done'}
              >
                <span>2</span>
                <h2>Withdraw</h2>
              </ProgressBarStep>

              <ProgressBarLineWrapper lineTwo>
                <ProgressBarDashedLine
                  MigrateProgressLine={ModeThemes[theme].MigrateProgressLine}
                  done={currentStep === 'stake' || currentStep === 'done'}
                ></ProgressBarDashedLine>
                <ProgressBarLine
                  MigrateProgressLine={ModeThemes[theme].MigrateProgressLine}
                  done={currentStep === 'stake' || currentStep === 'done'}
                ></ProgressBarLine>
              </ProgressBarLineWrapper>

              <ProgressBarStep
                MigrateProgressTextActive={ModeThemes[theme].MigrateProgressTextActive}
                MigrateProgressTextPending={ModeThemes[theme].MigrateProgressTextPending}
                MigrateStepBorder={ModeThemes[theme].MigrateStepBorder}
                MigrateStepTextPending={ModeThemes[theme].MigrateStepTextPending}
                MigrateStepText={ModeThemes[theme].MigrateStepText}
                Stake
                active={currentStep === 'stake'}
                done={currentStep === 'done'}
              >
                <span>3</span>
                <h2>Stake</h2>
              </ProgressBarStep>
            </StepProgressBarWrapper>
          </StakingModalHeader>

          {currentStep === 'claim'
            ? migrateClaim({ theme, currentStep, accruedRewards, oldSlice, migrateLoading, claimAndProgress })
            : currentStep === 'withdraw'
            ? migrateWithdraw({ theme, oldSlice, currentStep, migrateLoading, claimAndProgress })
            : currentStep === 'stake'
            ? migrateStakeSkip({ theme, newSlice, objId, setObjId, currentStep, claimAndProgress })
            : currentStep === 'done'
            ? migrateDone({ theme, currentStep, closeModal })
            : ''}
        </StakingModalContent>
      </StakingModalContentWrapper>
    </Modal>
  );
};

export const migrateClaim = ({ theme, currentStep, accruedRewards, oldSlice, migrateLoading, claimAndProgress }) => {
  return (
    <StakingMigrateModalContent>
      <RewardsAmountWrapper MigrateContentTitle={ModeThemes[theme].MigrateContentTitle}>
        <h2>{i18n.t('claimSlicePools')}</h2>
        <RewardsAmountCardsWrapper>
          <RewardsAmountCard
            MigrateClaimCardBackground={ModeThemes[theme].MigrateClaimCardBackground}
            MigrateClaimCardTitle={ModeThemes[theme].MigrateClaimCardTitle}
            MigrateClaimCardValue={ModeThemes[theme].MigrateClaimCardValue}
          >
            <h2>{i18n.t('AmountRewards')}</h2>
            <h2>
              {accruedRewards ? roundNumber(accruedRewards[oldSlice[0].tokenAddress]) : 0}
              <span>
                <img src={TrancheStake} alt='' />
                Slice
              </span>
            </h2>
          </RewardsAmountCard>
        </RewardsAmountCardsWrapper>
      </RewardsAmountWrapper>
      {!migrateLoading ? (
        <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => claimAndProgress('rewards')}>
          {i18n.t('claim')}
        </StakeModalFormBtn>
      ) : (
        <StakeModalFormBtn migrate step={currentStep} migrateStake>
          <LoadingButton>
            {[...Array(4).keys()].map((idx) => {
              return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
            })}
          </LoadingButton>
        </StakeModalFormBtn>
      )}
    </StakingMigrateModalContent>
  );
};
export const migrateWithdraw = ({ theme, oldSlice, currentStep, migrateLoading, claimAndProgress }) => {
  return (
    <StakingMigrateModalContent>
      <RewardsAmountWrapper MigrateContentTitle={ModeThemes[theme].MigrateContentTitle}>
        <h2>{i18n.t('WithdrawSlice')}</h2>
        <RewardsAmountCardsWrapper>
          <RewardsAmountCard
            MigrateClaimCardBackground={ModeThemes[theme].MigrateClaimCardBackground}
            MigrateClaimCardTitle={ModeThemes[theme].MigrateClaimCardTitle}
            MigrateClaimCardValue={ModeThemes[theme].MigrateClaimCardValue}
          >
            <h2>{i18n.t('TotalSliceWithdraw')}</h2>
            <h2>
              {roundNumber(oldSlice[0].subscription)}
              <span>
                <img src={TrancheStake} alt='' />
                Slice
              </span>
            </h2>
          </RewardsAmountCard>
        </RewardsAmountCardsWrapper>
      </RewardsAmountWrapper>

      {!migrateLoading ? (
        <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => claimAndProgress('oldStake')}>
          Withdraw
        </StakeModalFormBtn>
      ) : (
        <StakeModalFormBtn migrate step={currentStep} migrateStake>
          <LoadingButton>
            {[...Array(4).keys()].map((idx) => {
              return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
            })}
          </LoadingButton>
        </StakeModalFormBtn>
      )}
    </StakingMigrateModalContent>
  );
};

export const migrateStakeSkip = ({ theme, newSlice, objId, userStaked, adjustStake, remainingCap, migrateLoading, setObjId, currentStep, claimAndProgress }) => {
  return (
    <StakingMigrateModalContentWrapper skipStake>
      {objId === null ? (
        <StakingMigrateModalContent skipStake>
          <StakeNewWrapper MigrateContentTitle={ModeThemes[theme].MigrateContentTitle}>
            <h2>{i18n.t('stakeNew')}</h2>

            <StakeNewTable>
              <StakeNewTableHead>
                <StakeNewCol head pool color={ModeThemes[theme].TableHead}>
                  <h2>{i18n.t('stakingPool')}</h2>
                </StakeNewCol>
                <StakeNewCol head lockup color={ModeThemes[theme].TableHead}>
                  <h2>{i18n.t('lockup')}</h2>
                </StakeNewCol>
                <StakeNewCol head apy color={ModeThemes[theme].TableHead}>
                  <h2>apy</h2>
                </StakeNewCol>
                <StakeNewCol head stake color={ModeThemes[theme].TableHead}>
                  <h2>stake</h2>
                </StakeNewCol>
              </StakeNewTableHead>
              <StakeNewTableCards>
                {newSlice.map((stakingPool, i) => (
                  <StakeNewTableCard color={ModeThemes[theme].TableCard} borderColor={ModeThemes[theme].TableCardBorderColor} key={i}>
                    <StakeNewCol pool>
                      <StakeNewColFirst>
                        <StakeNewColImg>
                          <img src={TrancheStake} alt='' />
                        </StakeNewColImg>
                        <StakeNewColText color={ModeThemes[theme].tableText}>
                          <h2>{stakingPool.poolName}</h2>
                          <h2>{addrShortener(stakingPool.contractAddress)}</h2>
                        </StakeNewColText>
                      </StakeNewColFirst>
                    </StakeNewCol>

                    <StakeNewCol
                      lockupValue
                      lockup
                      docsLockupText={ModeThemes[theme].docsLockupText}
                      docsLockupBackground={ModeThemes[theme].docsLockupBackground}
                    >
                      <h2>
                        <span>{formatTime(stakingPool.duration)}</span>
                      </h2>
                    </StakeNewCol>

                    <StakeNewCol apyValue apy color={ModeThemes[theme].tableText}>
                      <h2>{stakingPool.apy}%</h2>
                    </StakeNewCol>

                    <StakeNewCol stake stakeValue disabled={stakingPool.remainingCap <= 0} disabledBtnColor={ModeThemes[theme].disabledBtnColor}>
                      <button onClick={() => setObjId(i)}>{stakingPool.remainingCap === 0 ? 'Capped' : 'Stake'}</button>
                    </StakeNewCol>
                  </StakeNewTableCard>
                ))}
              </StakeNewTableCards>
            </StakeNewTable>
          </StakeNewWrapper>

          <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => claimAndProgress('skip')} skipStake>
            {i18n.t('skipFor')}
          </StakeModalFormBtn>
        </StakingMigrateModalContent>
      ) : (
        <MigrateForm id={objId} theme={theme} newSlice={newSlice} setObjId={setObjId} userStaked={userStaked} adjustStake={adjustStake} remainingCap={remainingCap} migrateLoading={migrateLoading} />
      )}
    </StakingMigrateModalContentWrapper>
  );
};
export const MigrateForm = ({ id, theme, newSlice, setObjId, userStaked, adjustStake, remainingCap, migrateLoading }) => {
  return (
    <StakingMigrateModalContent>
      <SliceMigratedWrapper migrate>
        <StakingModalContentSideHeader BoxColor={ModeThemes[theme].BoxColor}>
          <StakingModalContentSideHeaderImg stake>
            <img src={TrancheStake} alt='img' />
          </StakingModalContentSideHeaderImg>
          <StakingModalContentSideHeaderText boxText={ModeThemes[theme].boxText} textColor={ModeThemes[theme].ModalText}>
            <h2>{newSlice[id].poolName} STAKING POOL</h2>
            <h2>{newSlice[id].contractAddress}</h2>
          </StakingModalContentSideHeaderText>
          <StakingModalChangeBtn onClick={() => setObjId(null)}>Change</StakingModalChangeBtn>
        </StakingModalContentSideHeader>
        <StakingModalContentSideHeaderBoxWrapper migrate>
          <StakingModalContentSideHeaderBox
            stake
            BoxColor={ModeThemes[theme].BoxColor}
            textColor={ModeThemes[theme].ModalText}
            BoxColorText={ModeThemes[theme].BoxColorText}
          >
            <h2>{i18n.t('lockup')}</h2>
            <h2>{formatTime(newSlice[id].duration)}</h2>
          </StakingModalContentSideHeaderBox>
          <StakingModalContentSideHeaderBox
            stake
            BoxColor={ModeThemes[theme].BoxColor}
            textColor={ModeThemes[theme].ModalText}
            BoxColorText={ModeThemes[theme].BoxColorText}
          >
            <h2>APY</h2>
            <h2>{roundNumber(newSlice[id].apy, false)}%</h2>
          </StakingModalContentSideHeaderBox>
          <StakingModalContentSideHeaderBox
            BoxColor={ModeThemes[theme].BoxColor}
            textColor={ModeThemes[theme].ModalText}
            BoxColorText={ModeThemes[theme].BoxColorText}
          >
            <h2>Remaining Capacity</h2>
            <h2>{roundNumber(newSlice[id].remainingCap, false)} SLICE</h2>
          </StakingModalContentSideHeaderBox>
        </StakingModalContentSideHeaderBoxWrapper>

        <StakingForm
          modalTypeVar='staking'
          type={newSlice[id].type}
          tokenAddress={newSlice[id].tokenAddress}
          contractAddress={newSlice[id].contractAddress}
          durationIndex={newSlice[id].durationIndex}
          apy={newSlice[id].apy}
          duration={newSlice[id].duration}
          userStaked={userStaked}
          adjustStake={adjustStake}
          migrate={true}
          remainingCap={remainingCap}
          migrateLoading={migrateLoading}
        />
      </SliceMigratedWrapper>
    </StakingMigrateModalContent>
  );
};

export const migrateDone = ({ theme, currentStep, closeModal }) => {
  return (
    <StakingMigrateModalContent>
      <SliceMigratedWrapper>
        <img src={Migrated} alt='' />
        <SliceMigratedText MigrateContentTitle={ModeThemes[theme].MigrateContentTitle} CongratsText={ModeThemes[theme].CongratsText}>
          <h2>{i18n.t('congrats')}</h2>
          <h2>{i18n.t('tokenMigrated')}</h2>
        </SliceMigratedText>
      </SliceMigratedWrapper>
      <StakeModalFormBtn migrate step={currentStep} migrateStake onClick={() => closeModal()}>
        {i18n.t('close')}
      </StakeModalFormBtn>
    </StakingMigrateModalContent>
  );
};