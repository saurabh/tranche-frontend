import React from 'react';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CheckBtnWhite, CloseModal, CloseModalWhite, LinkIcon, Migrated, TranchePending, TranchePendingLight, TrancheRejected } from 'assets';
import { ModeThemes, trancheIcons } from 'config/constants';
import { roundNumber, searchTokenDecimals } from 'utils';
import { fromWei } from 'services';

import {
  ModalHeader,
  TrancheModalWrapper,
  TrancheModalHeader,
  TrancheModalContent,
  TrancheModalContentHeader,
  TrancheModalContentRow,
  TrancheModalFooter,
  TrancheModalContentHeaderImg,
  TrancheModalContentHeaderText,
  LoadingButton,
  LoadingButtonCircle,
  TrancheModalContentStatus,
  TrancheConfirmModal
} from '../../styles/ModalsComponents';

export const TrancheConfirm = ({
  theme,
  formValues,
  tokenBalance,
  txModalIsOpen,
  txModalStatus,
  txLoading,
  txLink,
  name,
  apyStatus,
  cryptoType,
  trancheToken,
  dividendType,
  apy,
  protocolAPY,
  sliceAPY,
  netAPY,
  isDeposit,
  buyerCoinAddress,
  trancheTokenAddress,
  // Functions
  closeModal,
  handleSubmit
}) => {
  return (
    <Modal
      isOpen={txModalIsOpen}
      onRequestClose={closeModal}
      style={TrancheConfirmModal}
      closeTimeoutMS={200}
      shouldCloseOnOverlayClick={false}
      contentLabel='Adjust'
      portalClassName='TrancheConfirmModal'
    >
      <TrancheModalWrapper backgroundColor={ModeThemes[theme].ModalBackground} TrancheConfirm>
        <TrancheModalHeader color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder} TrancheConfirm>
          {/* <h2>TRANCHE REWARDS</h2> */}
          <ModalHeader tranche ModalBackground={ModeThemes[theme].ModalBackground} enableModal>
            <button onClick={() => closeModal()}>
              <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
            </button>
          </ModalHeader>
          <TrancheModalContentHeader color={ModeThemes[theme].ModalTrancheTextColor} enableModal>
            <TrancheModalContentHeaderImg>
              <img src={trancheIcons[trancheToken] && trancheIcons[trancheToken].protocolIcon} alt='img' />
              <span>
                <img src={trancheIcons[trancheToken] && trancheIcons[trancheToken].assetIcon} alt='img' />
              </span>
            </TrancheModalContentHeaderImg>
            <TrancheModalContentHeaderText
              rateColor={ModeThemes[theme].TrancheRateTypeColor}
              color={ModeThemes[theme].ModalTrancheTextColor}
              textColor={ModeThemes[theme].textColor}
            >
              <h2>{name}</h2>
              <div>
                <h2>{trancheToken}</h2>
                <h2>{apyStatus === 'fixed' ? apyStatus : 'Variable'}</h2>
              </div>
            </TrancheModalContentHeaderText>
          </TrancheModalContentHeader>
        </TrancheModalHeader>
        {txModalStatus === 'initialState' ? (
          <TrancheModalContent color={ModeThemes[theme].ModalTrancheTextColor} initialStatus>
            <h2>
              {isDeposit ? 'Deposit in' : 'Withdraw from'} {apyStatus === 'fixed' ? 'Tranche A' : 'Tranche B'}
            </h2>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>{dividendType} APY</h2>
              <h2>{roundNumber(protocolAPY, 2)}%</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>Tranche APY</h2>
              <h2>{roundNumber(apy, 2)}%</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>SLICE APY</h2>
              <h2>{roundNumber(sliceAPY, 2)}%</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow noBorder color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>Net APY</h2>
              <h2>{roundNumber(netAPY, 2)}%</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>{isDeposit ? 'Depositing' : 'Withdrawing'}</h2>
              <h2>
                {isDeposit
                  ? formValues
                    ? `${roundNumber(formValues.depositAmount)} ${cryptoType}`
                    : `0 ${cryptoType}`
                  : formValues
                  ? `${roundNumber(formValues.withdrawAmount)}  ${trancheToken}`
                  : `0 ${trancheToken}`}
              </h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow noBorder color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>Your Wallet Balance</h2>
              <h2>
                {isDeposit
                  ? searchTokenDecimals(cryptoType)
                    ? `${roundNumber(fromWei(tokenBalance[buyerCoinAddress] || '0', 'Mwei'))} ${cryptoType}`
                    : `${roundNumber(fromWei(tokenBalance[buyerCoinAddress] || '0'))} ${cryptoType}`
                  : `${roundNumber(fromWei(tokenBalance[trancheTokenAddress] || '0'))} ${trancheToken}`}
              </h2>
            </TrancheModalContentRow>
          </TrancheModalContent>
        ) : txModalStatus === 'confirm' ? (
          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor}>
            <h2>
              {isDeposit ? 'Deposit in' : 'Withdraw from'} {apyStatus === 'fixed' ? 'Tranche A' : 'Tranche B'}
            </h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
              <img src={theme === 'light' ? TranchePendingLight : TranchePending} alt='img' />
              <h2>Confirm Transaction</h2>
            </TrancheModalContentStatus>
          </TrancheModalContent>
        ) : txModalStatus === 'pending' ? (
          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor}>
            <h2>
              {isDeposit ? 'Deposit in' : 'Withdraw from'} {apyStatus === 'fixed' ? 'Tranche A' : 'Tranche B'}
            </h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
              <img src={theme === 'light' ? TranchePendingLight : TranchePending} alt='img' />
              <h2>Transaction Pending</h2>
            </TrancheModalContentStatus>
          </TrancheModalContent>
        ) : txModalStatus === 'success' ? (
          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor}>
            <h2>
              {isDeposit ? 'Deposit in' : 'Withdraw from'} {apyStatus === 'fixed' ? 'Tranche A' : 'Tranche B'}
            </h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
              <img src={Migrated} alt='img' />
              <h2>Transaction Successful</h2>
            </TrancheModalContentStatus>
          </TrancheModalContent>
        ) : txModalStatus === 'failed' || txModalStatus === 'rejected' ? (
          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor}>
            <h2>
              {isDeposit ? 'Deposit in' : 'Withdraw from'} {apyStatus === 'fixed' ? 'Tranche A' : 'Tranche B'}
            </h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
              <img src={TrancheRejected} alt='img' />
              {txModalStatus === 'failed' ? <h2>Transaction Failed</h2> : txModalStatus === 'cancelled' ? <h2>Transaction Cancelled</h2> : <h2>Transaction Rejected</h2>}
            </TrancheModalContentStatus>
          </TrancheModalContent>
        ) : (
          ''
        )}
        {txModalStatus === 'initialState' || txModalStatus === 'confirm' ? (
          <TrancheModalFooter
            color={ModeThemes[theme].ModalTrancheTextColor}
            disabledColor={ModeThemes[theme].DisabledBtn}
            disabledTextColor={ModeThemes[theme].DisabledBtnText}
          >
            {txLoading ? (
              <button>
                <LoadingButton>
                  {[...Array(4).keys()].map((idx) => {
                    return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
                  })}
                </LoadingButton>
              </button>
            ) : (
              <button
                onClick={() => {
                  handleSubmit();
                }}
              >
                <img src={CheckBtnWhite} alt='img' /> Confirm
              </button>
            )}
          </TrancheModalFooter>
        ) : (
          txModalStatus !== 'rejected' && (
            <TrancheModalFooter
              color={ModeThemes[theme].ModalTrancheTextColor}
              link
              TrancheEnableConfirm
              disabledColor={ModeThemes[theme].DisabledBtn}
              disabledTextColor={ModeThemes[theme].DisabledBtnText}
            >
              <a href={txLink} target='_blank' rel='noreferrer noopener'>
                <img src={LinkIcon} alt='img' /> View on Etherscan
              </a>
            </TrancheModalFooter>
          )
        )}
      </TrancheModalWrapper>
    </Modal>
  );
};