import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { number } from 'utils/validations';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal, CloseModalWhite, FTMIconInput, LinkIcon, TranchePending, TranchePendingLight } from 'assets';
import { ModeThemes } from 'config/constants';
import { WrapForm } from '../../../Form/wrapForm';
import { ModalHeader, ModalMarketWrapper, ModalMarketWrapperBtn, TrancheWFTMStyles, TrancheModalContent, TrancheModalWrapper, WrapFTMHeader, TrancheModalHeader, TrancheModalContentHeader, TrancheModalContentHeaderImg, TrancheModalContentHeaderText, TrancheModalContentStatus, TrancheModalFooter, LoadingButton, LoadingButtonCircle } from '../../styles/ModalsComponents';
import { FormContentWrapper, FormContent, WrapSubmitBtn } from 'app/components/Stake/Table/styles/TableComponents';
import { roundNumber } from 'utils';
import { wrapFTM, unwrapFTM } from 'services';


export const TrancheWFTM = ({ theme, txModalIsOpen, txModalStatus, txOngoingData: { wrap }, closeModal, txModalType, cryptoType, buyerTokenBalance, FTMBalance }) => {
  // const setMaxAmount = useCallback(
  //   (e, type) => {
  //     // e.preventDefault();
  //     if (type) {
  //       change('depositAmount', buyerTokenBalance);
  //       isEqualTo(buyerTokenBalance, 0) ? setDepositBalanceCheck('InputStylingError') : setDepositBalanceCheck('');
  //     } else {
  //       change('withdrawAmount', trancheTokenBalance);
  //       isEqualTo(trancheTokenBalance, 0) ? setWithdrawBalanceCheck('InputStylingError') : setWithdrawBalanceCheck('');
  //     }
  //   },
  //   [buyerTokenBalance, trancheTokenBalance, change]
  // );

  const TrancheWFTMToFTM = () => {
    return(
      <TrancheModalWrapper backgroundColor={ModeThemes[theme].ModalBackground} TrancheWFTM>
        <WrapForm theme={theme} closeModal={closeModal} txModalType={txModalType} cryptoType={cryptoType} buyerTokenBalance={buyerTokenBalance} FTMBalance={FTMBalance} />
      </TrancheModalWrapper>
    )
  }
  const TrancheWFTMToFTMStatus = () => {
    return(
      <TrancheModalWrapper backgroundColor={ModeThemes[theme].ModalBackground} TrancheWFTM>
        <TrancheModalHeader color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder} TrancheWFTM>
          <ModalHeader tranche ModalBackground={ModeThemes[theme].ModalBackground} enableModal>
            <button onClick={() => closeModal()}>
              <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
            </button>
          </ModalHeader>
          <TrancheModalContentHeader color={ModeThemes[theme].ModalTrancheTextColor} TrancheWFTM>
            <TrancheModalContentHeaderImg TrancheWFTM>
              <img src={FTMIconInput} alt='img' />
            </TrancheModalContentHeaderImg>
            <TrancheModalContentHeaderText
              rateColor={ModeThemes[theme].TrancheRateTypeColor}
              color={ModeThemes[theme].ModalTrancheTextColor}
              textColor={ModeThemes[theme].textColor}
              TrancheWFTM
            >
              <h2>{ wrap ? 'Wrapping' : 'Unwrapping' }</h2>
            </TrancheModalContentHeaderText>
          </TrancheModalContentHeader>
          </TrancheModalHeader>

          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor} TrancheWFTMStatus>
            <h2>
              { wrap ? 'FTM to WFTM' : 'WFTM to FTM' }
            </h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor} TrancheWFTMStatus>
              <img src={theme === 'light' ? TranchePendingLight : TranchePending} alt='img' /> {/* TrancheRejected - Migrated */}
             { txModalStatus === 'confirm' ? <h2>Confirm Transaction</h2> : wrap ? <h2>Wrapping</h2> : <h2>Unwrapping</h2> }
            </TrancheModalContentStatus>
            
          </TrancheModalContent>
          <TrancheModalFooter
              color={ModeThemes[theme].ModalTrancheTextColor}
              link
              TrancheEnableConfirm
              disabledColor={ModeThemes[theme].DisabledBtn}
              disabledTextColor={ModeThemes[theme].DisabledBtnText}
              TrancheWFTMStatus
            >
             { txModalStatus === 'confirm' && <button>
                <LoadingButton>
                    {[...Array(4).keys()].map((idx) => {
                      return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
              })}
                    </LoadingButton>
              </button>}
              {txModalStatus !== 'confirm' && <a href="/" target='_blank' rel='noreferrer noopener'>
                <img src={LinkIcon} alt='img' />View on Explorer
              </a>}
            </TrancheModalFooter>
      </TrancheModalWrapper>
    )
  }
  return (
    <Modal
      isOpen={txModalIsOpen}
      onRequestClose={closeModal}
      style={TrancheWFTMStyles}
      closeTimeoutMS={200}
      shouldCloseOnOverlayClick={false}
      contentLabel='Adjust'
      portalClassName='TrancheMarketsModal'
    >
      
      { txModalStatus === 'initialState' ? <TrancheWFTMToFTM /> : <TrancheWFTMToFTMStatus /> }
    </Modal>
  );
};
