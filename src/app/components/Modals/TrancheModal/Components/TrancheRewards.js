import React from 'react';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal, CloseModalWhite, TrancheStake, LinkIcon, Migrated, TranchePending, TranchePendingLight, TrancheRejected } from 'assets';
import { ModeThemes } from 'config/constants';
import { roundNumber } from 'utils';
import { claimRewardsAllMarkets } from 'services';

import {
  ModalHeader,
  TrancheModalWrapper,
  TrancheModalHeader,
  TrancheModalContent,
  TrancheModalContentHeader,
  TrancheModalContentStatus,
  TrancheModalContentRow,
  TrancheModalFooter,
  TrancheRewardsStyles,
  LoadingButton,
  LoadingButtonCircle
} from '../../styles/ModalsComponents';

export const TrancheRewards = ({
  theme,
  totalSlice,
  totalSliceInUSD,
  totalSliceBalance,
  unclaimedSlice,
  exchangeRates,
  txModalIsOpen,
  txModalStatus,
  txLoading,
  txLink,
  txOngoing,
  closeModal
}) => {
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
        <TrancheModalWrapper backgroundColor={ModeThemes[theme].ModalBackground} TrancheRewards>
          <TrancheModalHeader
            color={ModeThemes[theme].ModalTrancheTextColor}
            border={ModeThemes[theme].ModalTrancheTextRowBorder}
            trancheRewardsModal
          >
            <h2>TRANCHE REWARDS</h2>
            <ModalHeader tranche ModalBackground={ModeThemes[theme].ModalBackground}>
              <button onClick={() => closeModal()}>
                <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
              </button>
            </ModalHeader>
          </TrancheModalHeader>

          {
            txModalStatus === 'initialState' ?
              <TrancheModalContent color={ModeThemes[theme].ModalTrancheTextColor} TrancheRewards>
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
            : txModalStatus === 'confirm' ?    
              <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor} TrancheRewards>
                <h2>Claiming {roundNumber(unclaimedSlice)} SLICE</h2>
                <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
                  <img src={theme === 'light' ? TranchePendingLight : TranchePending} alt='img' />
                  <h2>Confirm Transaction</h2>
                </TrancheModalContentStatus>
              </TrancheModalContent>  
            : txModalStatus === 'pending' ? 
              <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor}>
                <h2>Claiming {roundNumber(unclaimedSlice)} SLICE</h2>
                <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
                  <img src={theme === 'light' ? TranchePendingLight : TranchePending} alt='img' />
                  <h2>Transaction Pending</h2>
                </TrancheModalContentStatus>
              </TrancheModalContent>

             : txModalStatus === 'success' ? 
              <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor} TrancheRewards>
                <h2>Claiming {roundNumber(unclaimedSlice)} SLICE</h2>
                <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
                  <img src={Migrated} alt='img' />
                  <h2>Transaction Successful</h2>
                </TrancheModalContentStatus>
              </TrancheModalContent>
            : txModalStatus === 'failed' || txModalStatus === 'rejected' || txModalStatus === 'cancelled' ?   
              <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor} TrancheRewards>
                <h2>Claiming {roundNumber(unclaimedSlice)} SLICE</h2>
                <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
                  <img src={TrancheRejected} alt='img' />
                  {txModalStatus === 'failed' ? <h2>Transaction Failed</h2> : txModalStatus === 'cancelled' ? <h2>Transaction Cancelled</h2> : <h2>Transaction Rejected</h2>}
                </TrancheModalContentStatus>
              </TrancheModalContent> 
            :
            ''
          }

          
          {/* { ((claimSuccess || !claimSuccess) && claimState !== 'claimInitialState') ?
          <TrancheModalFooter color={ModeThemes[theme].ModalTrancheTextColor} link TrancheEnableConfirm disabledColor={ModeThemes[theme].DisabledBtn} disabledTextColor={ModeThemes[theme].DisabledBtnText}>
            <a href={txLink} target='_blank' rel='noreferrer noopener'>
              <img src={LinkIcon} alt='img' /> View on Etherscan
            </a>
          </TrancheModalFooter> :
          <TrancheModalFooter color={ModeThemes[theme].ModalTrancheTextColor} disabledColor={ModeThemes[theme].DisabledBtn} disabledTextColor={ModeThemes[theme].DisabledBtnText}>
            {
              txLoading ?
                <button>
                  <LoadingButton>
                    {[...Array(4).keys()].map((idx) => {
                      return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
                    })}
                  </LoadingButton>
                </button>
              :
              <button onClick={onClaimReward} disabled={txOngoing || unclaimedSlice <= 0}>
                Claim {roundNumber(unclaimedSlice)} SLICE
              </button>
            }
            {
              txModalStatus === 'initialState' ?
              <h2>
                Looking for Staking Rewards? <a href='/stake'>Click Here</a>
              </h2> : 
              ''
            }
            
          </TrancheModalFooter> 
          
        } */}

          {txModalStatus === 'initialState' || txModalStatus === 'confirm' ? (
            <TrancheModalFooter color={ModeThemes[theme].ModalTrancheTextColor} disabledColor={ModeThemes[theme].DisabledBtn} disabledTextColor={ModeThemes[theme].DisabledBtnText}>
              {txLoading ? (
                <button>
                  <LoadingButton>
                    {[...Array(4).keys()].map((idx) => {
                      return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
                    })}
                  </LoadingButton>
                </button>
              ) : (
                <button onClick={claimRewardsAllMarkets} disabled={txOngoing || unclaimedSlice <= 0}>
                  Claim {roundNumber(unclaimedSlice)} SLICE
                </button>
              )}
            </TrancheModalFooter>
          ) : txModalStatus !== 'rejected' && (
            <TrancheModalFooter color={ModeThemes[theme].ModalTrancheTextColor} link TrancheEnableConfirm disabledColor={ModeThemes[theme].DisabledBtn} disabledTextColor={ModeThemes[theme].DisabledBtnText}>
              <a href={txLink} target='_blank' rel='noreferrer noopener'>
                <img src={LinkIcon} alt='img' /> View on Etherscan
              </a>
            </TrancheModalFooter>
          )}
          
          {txModalStatus === 'initialState' && (
            <TrancheModalFooter color={ModeThemes[theme].ModalTrancheTextColor} disabledColor={ModeThemes[theme].DisabledBtn} disabledTextColor={ModeThemes[theme].DisabledBtnText} >
              <h2>
                Looking for Staking Rewards? <a href='/stake'>Click Here</a>
              </h2>
            </TrancheModalFooter>
          )}
        </TrancheModalWrapper>
      </Modal>
  );
};