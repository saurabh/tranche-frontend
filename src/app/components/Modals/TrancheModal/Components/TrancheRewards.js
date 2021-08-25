import React from 'react';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal, CloseModalWhite, TrancheStake } from 'assets';
import { ModeThemes } from 'config/constants';
import { roundNumber } from 'utils';
import { claimRewardsAllMarkets } from 'services';

import {
  ModalHeader,
  TrancheModalWrapper,
  TrancheModalHeader,
  TrancheModalContent,
  TrancheModalContentHeader,
  TrancheModalContentRow,
  TrancheModalFooter,
  TrancheRewardsStyles
} from '../../styles/ModalsComponents';

export const TrancheRewards = ({
  theme,
  totalSlice,
  totalSliceInUSD,
  totalSliceBalance,
  unclaimedSlice,
  exchangeRates,
  txModalIsOpen,
  txOngoing,
  closeModal
}) => {
  const onClaimReward = () => {
    claimRewardsAllMarkets();
    closeModal();
  };

  return (
    <Modal
      isOpen={txModalIsOpen}
      onRequestClose={closeModal}
      style={TrancheRewardsStyles}
      closeTimeoutMS={200}
      shouldCloseOnOverlayClick={false}
      contentLabel='Adjust'
      portalClassName='TrancheRewardsModal'
    >
      <TrancheModalWrapper backgroundColor={ModeThemes[theme].ModalBackground}>
        <TrancheModalHeader color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder} trancheRewardsModal>
          <h2>TRANCHE REWARDS</h2>
          <ModalHeader tranche ModalBackground={ModeThemes[theme].ModalBackground}>
            <button onClick={() => closeModal()}>
              <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
            </button>
          </ModalHeader>
        </TrancheModalHeader>

        <TrancheModalContent color={ModeThemes[theme].ModalTrancheTextColor}>
          <TrancheModalContentHeader color={ModeThemes[theme].ModalTrancheTextColor} trancheRewardsModal>
            <img src={TrancheStake} alt='img' />
            <h2>{totalSlice}</h2>
            <h2>(${totalSliceInUSD})</h2>
          </TrancheModalContentHeader>
          <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
            <h2>Wallet Balance </h2>
            <h2>{roundNumber(totalSliceBalance)}</h2>
          </TrancheModalContentRow>
          <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
            <h2>Unclaimed Balance</h2>
            <h2>{roundNumber(unclaimedSlice)}</h2>
          </TrancheModalContentRow>
          <TrancheModalContentRow noBorder color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
            <h2>Price</h2>
            <h2>${roundNumber(exchangeRates.SLICE, 2)}</h2>
          </TrancheModalContentRow>
        </TrancheModalContent>

        <TrancheModalFooter
          color={ModeThemes[theme].ModalTrancheTextColor}
          disabledColor={ModeThemes[theme].DisabledBtn}
          disabledTextColor={ModeThemes[theme].DisabledBtnText}
        >
          <button onClick={onClaimReward} disabled={txOngoing || unclaimedSlice <= 0}>
            Claim {roundNumber(unclaimedSlice)} SLICE
          </button>
          <h2>
            Looking for Staking Rewards? <a href='/stake'>Click Here</a>
          </h2>
        </TrancheModalFooter>
      </TrancheModalWrapper>
    </Modal>
  );
};
