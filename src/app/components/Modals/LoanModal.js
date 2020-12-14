import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert';
import { AdjustLoan } from 'app/components/Form/AdjustLoan';
import { CloseModal } from 'assets';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { statuses, actionTypes } from 'config/constants';
import { roundNumber, gweiOrEther, roundBasedOnUnit } from 'utils';

import {
  ModalHeader,
  ModalContent,
  BtnGrpLoanModal,
  ModalButton,
  ConfirmAlertWrapper,
  ConfirmAlertBtnWrapper,
  BtnGrpLoanModalWrapper,
  ModalActionsContent,
  ModalActionDetails,
  ModalUserActions,
  ModalActionDetailsContent,
  LoanDetailsRow,
  LoanDetailsRowTitle,
  LoanDetailsRowValue,
  BtnLoadingIcon
} from './styles/ModalsComponents';

const FirstCustomStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  },
  content: {
    position: 'relative',
    maxWidth: '831px',
    width: '100%',
    minHeight: '554px',
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
const AdjustPositionStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  },
  content: {
    position: 'relative',
    maxWidth: '831px',
    width: '100%',
    minHeight: '454px',
    //minHeight: '326px',
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

const LoanModal = ({
  modalIsOpen,
  closeModal,
  path,
  loanId,
  contractAddress,
  status,
  hasBalance,
  isShareholder,
  APY,
  accruedInterest,
  canBeForeclosed,
  blocksUntilForeclosure,
  approveLoan,
  closeLoan,
  adjustLoan,
  withdrawInterest,
  forecloseLoan,
  newCollateralRatio,
  setNewCollateralRatio,
  calcNewCollateralRatio,
  interestPaid,
  rpbRate,
  collateralTypeName,
  remainingLoan,
  totalInterest,
  collateralRatio,
  collateralAmount,
  cryptoFromLenderName
}) => {
  const [adjustPosition, adjustPositionToggle] = useState(false);
  const [isAdjustSelected, setIsAdjustSelected] = useState(false);
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const loanStatusPending = status === statuses['Pending'].status;

  useEffect(() => {
    if(cryptoFromLenderName === 'USDC'){
      setApproved(false)
    }
    else{
      setApproved(true);
    }
  }, [cryptoFromLenderName])

  const confirm = (type) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmAlertWrapper>
            {type === 'Close' ? (
              <h2>Are you sure you want to return {remainingLoan + ' ' + cryptoFromLenderName}?</h2>
            ) : (
              <h2>{actionTypes[type].confirmationText}</h2>
            )}
            {/*{type === 'WithdrawInterest' && (
              <h5>Accrued Interest: {accruedInterest + ' ' + collateralTypeName}</h5>
            )}*/}
            <ConfirmAlertBtnWrapper>
              <ModalButton
                onClick={onClose}
                btnColor='rgba(35,69,102,0.7)'
                backgroundColor='#EAEAEA'
              >
                No
              </ModalButton>
              <ModalButton
                btnColor='rgba(35,69,102,0.7)'
                backgroundColor='#EAEAEA'
                confirmBtn={true}
                onClick={() => {
                  controlAction(type, onClose);
                }}
              >
                Yes
              </ModalButton>
            </ConfirmAlertBtnWrapper>
          </ConfirmAlertWrapper>
        );
      }
    });
  };

  const controlAction = (type, onClose) => {
    if (type === actionTypes['Cancel'].name || type === actionTypes['Close'].name) {
      closeLoan();
      closeModal();
      onClose();
    } else if (type === actionTypes['Approve'].name) {
      approveLoan();
      closeModal();
      onClose();
    } else if (type === actionTypes['WithdrawInterest'].name) {
      withdrawInterest();
      closeModal();
      onClose();
    } else if (type === actionTypes['Foreclose'].name) {
      forecloseLoan();
      closeModal();
      onClose();
    }
  };

  const modalClose = () => {
    closeModal();
    adjustPositionToggle(false);
    setIsAdjustSelected(false);
    setNewCollateralRatio(0);
  };

  const borrowModal = () => {
    return (
      <div>
        {!adjustPosition ? (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={FirstCustomStyles}
            shouldCloseOnOverlayClick={false}
            contentLabel='Adjust'
          >
            <ModalHeader>
              <h2>
                {status === statuses['Pending'].status
                  ? 'Manage Loan Request'
                  : status === statuses['Under_Collateralized'].status
                  ? 'Manage Loan Position'
                  : 'Manage Loan'}
              </h2>
              <button onClick={() => modalClose()}>
                <img src={CloseModal} alt='' />
              </button>
            </ModalHeader>

            <ModalActionsContent>
              <ModalActionDetails>
                <ModalActionDetailsContent>
                  <LoanDetailsRow>
                    <LoanDetailsRowTitle>Loan amount</LoanDetailsRowTitle>

                    <LoanDetailsRowValue>
                      {remainingLoan} {cryptoFromLenderName}
                    </LoanDetailsRowValue>
                  </LoanDetailsRow>

                  <LoanDetailsRow>
                    <LoanDetailsRowTitle>Collateral amount</LoanDetailsRowTitle>

                    <LoanDetailsRowValue>
                      {roundNumber(collateralAmount)} {collateralTypeName}
                    </LoanDetailsRowValue>
                  </LoanDetailsRow>

                  <LoanDetailsRow>
                    <LoanDetailsRowTitle>Collateral ratio</LoanDetailsRowTitle>

                    <LoanDetailsRowValue>{collateralRatio}%</LoanDetailsRowValue>
                  </LoanDetailsRow>

                  <LoanDetailsRow>
                    <LoanDetailsRowTitle>Rpb</LoanDetailsRowTitle>

                    <LoanDetailsRowValue>
                      {roundBasedOnUnit(rpbRate, collateralTypeName)}{' '}
                      {gweiOrEther(rpbRate, collateralTypeName)}
                    </LoanDetailsRowValue>
                  </LoanDetailsRow>

                  <LoanDetailsRow>
                    <LoanDetailsRowTitle>APY</LoanDetailsRowTitle>

                    <LoanDetailsRowValue>{APY}%</LoanDetailsRowValue>
                  </LoanDetailsRow>

                  {/*<div>
                    <h2>
                      <span>APY</span>
                    </h2>
                    <h2>
                      {interestPaid} {collateralTypeName}
                    </h2>
                  </div>*/}
                </ModalActionDetailsContent>
              </ModalActionDetails>

              <ModalUserActions>
                <ModalContent>
                  <BtnGrpLoanModal>
                    <BtnGrpLoanModalWrapper>
                      {status === statuses['Under_Collateralized'].status ? (
                        <h2>
                          Your loan is undercollateralized, add collateral to avoid foreclosure.
                        </h2>
                      ) : (
                        <h2>
                          Increase or decrease your collateral amount based on market conditions.
                        </h2>
                      )}

                      <ModalButton
                        disabled={loanStatusPending}
                        onClick={() => adjustPositionToggle(true)}
                        grayBtn={true}
                        backgroundColor='#EAEAEA'
                        btnColor='#234566'
                      >
                        Adjust Collateral
                        <span></span>
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>

                    <BtnGrpLoanModalWrapper>
                      <h2>
                        {!hasBalance
                          ? `You don't have enough ${cryptoFromLenderName} for this action.`
                          : 'Return the loan amount and pay outstanding interest.'}
                      </h2>
                      <ModalButton
                        onClick={() => confirm('Close')}
                        backgroundColor='#0A66E1'
                        btnColor='#FFFFFF'
                        loading={(!approved && loading) ? true : false}
                        disabled={!hasBalance}
                      >
                        
                        {(!approved && !loading && (status === statuses['Active'].status)) ? 'Request Approval' : (approved && !loading) ? ' Close Loan' : ''}
                       
                        {
                          ((!approved && !loading) || (approved && !loading)) ?
                          <span></span> : ''
                        }
                        {
                          loading ? 
                          <div className="btnLoadingIconWrapper">
                            <div className="btnLoadingIconCut">
                              <BtnLoadingIcon loadingColor='#0A66E1'></BtnLoadingIcon>
                            </div>
                          </div> : ''
                        }
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>
                  </BtnGrpLoanModal>
                </ModalContent>
              </ModalUserActions>
            </ModalActionsContent>
          </Modal>
        ) : (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={AdjustPositionStyles}
            shouldCloseOnOverlayClick={false}
            contentLabel='AdjustPosition'
          >
            <ModalHeader>
              <h2>Adjust Position</h2>
              <button onClick={() => modalClose()}>
                <img src={CloseModal} alt='' />
              </button>
            </ModalHeader>
            <AdjustLoan
              isAdjustSelected={isAdjustSelected}
              setIsAdjustSelected={setIsAdjustSelected}
              adjustPositionToggle={adjustPositionToggle}
              loanId={loanId}
              contractAddress={contractAddress}
              collateralTypeName={collateralTypeName}
              adjustLoan={adjustLoan}
              setNewCollateralRatio={setNewCollateralRatio}
              remainingLoan={remainingLoan}
              cryptoFromLenderName={cryptoFromLenderName}
              collateralAmount={collateralAmount}
              newCollateralRatio={newCollateralRatio}
              collateralRatio={collateralRatio}
              calcNewCollateralRatio={calcNewCollateralRatio}
            />
          </Modal>
        )}
      </div>
    );
  };

  const earnModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={FirstCustomStyles}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
      >
        <ModalHeader>
          <h2>
            {status === statuses['Pending'].status ? 'Review Loan Request' : 'Manage Earning Asset'}
          </h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>

        <ModalActionsContent>
          <ModalActionDetails>
            <ModalActionDetailsContent row4={status !== statuses['Pending'].status}>
              <LoanDetailsRow>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  Loan amount
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>
                  {remainingLoan} {cryptoFromLenderName}
                </LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  Collateral amount
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>
                  {roundNumber(collateralAmount)} {collateralTypeName}
                </LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  Collateral ratio
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>{collateralRatio}%</LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  Rpb
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>
                  {roundBasedOnUnit(rpbRate, collateralTypeName)}{' '}
                  {gweiOrEther(rpbRate, collateralTypeName)}
                </LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  APY
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>{APY}%</LoanDetailsRowValue>
              </LoanDetailsRow>

              {status !== statuses['Pending'].status ? (
                <LoanDetailsRow>
                  <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                    Interest accrued
                  </LoanDetailsRowTitle>

                  <LoanDetailsRowValue>
                    {roundBasedOnUnit(totalInterest, collateralTypeName)}{' '}
                    {gweiOrEther(totalInterest, collateralTypeName)}
                  </LoanDetailsRowValue>
                </LoanDetailsRow>
              ) : (
                ''
              )}
            </ModalActionDetailsContent>
          </ModalActionDetails>
          <ModalUserActions>
            <ModalContent>
              <BtnGrpLoanModal>
                {status === statuses['Pending'].status ? (
                  <BtnGrpLoanModalWrapper>
                    <h2>
                      {!hasBalance
                        ? `You don't have enough ${cryptoFromLenderName} for this action.`
                        : `You are lending ${remainingLoan + ' ' + cryptoFromLenderName} backed by a
                      collateral ratio of ${collateralRatio}%.`}
                    </h2>
                    <ModalButton
                      onClick={() => confirm('Approve')} //handle onClick todo
                      btnColor='#ffffff'
                      backgroundColor='#2ECC71'
                      loading={(!approved && loading) ? true : false}
                      disabled={!hasBalance}
                    >
                      {(!approved && !loading) ? 'Request Approval' : (approved && !loading) ? 'Accept loan Request' : ''}
                      {
                        ((!approved && !loading) || (approved && !loading)) ?
                        <span></span> : ''
                      }
                      {
                        loading ? 
                        <div className="btnLoadingIconWrapper">
                          <div className="btnLoadingIconCut">
                            <BtnLoadingIcon loadingColor='#2ECC71'></BtnLoadingIcon>
                          </div>
                        </div> : ''
                      }
                      
                    </ModalButton>
                    

                  </BtnGrpLoanModalWrapper>
                ) : status === statuses['Active'].status ? (
                  <BtnGrpLoanModalWrapper>
                    <h2>
                      Available Interest: {roundBasedOnUnit(accruedInterest, collateralTypeName)}{' '}
                      {gweiOrEther(accruedInterest, collateralTypeName)}
                    </h2>
                    <ModalButton
                      onClick={() => confirm('WithdrawInterest')}
                      btnColor='#234566'
                      backgroundColor='#EAEAEA'
                    >
                      Withdraw Interest
                      <span></span>
                    </ModalButton>
                  </BtnGrpLoanModalWrapper>
                ) : status === statuses['Under_Collateralized'].status ? (
                  <BtnGrpLoanModal>
                    <BtnGrpLoanModalWrapper>
                      <h2>
                        Available Interest: {roundBasedOnUnit(interestPaid, collateralTypeName)}{' '}
                        {gweiOrEther(interestPaid, collateralTypeName)}
                      </h2>
                      <ModalButton
                        onClick={() => confirm('WithdrawInterest')}
                        btnColor='#234566'
                        backgroundColor='#EAEAEA'
                        display={!isShareholder ? 'none' : ''}
                      >
                        Withdraw Interest
                        <span></span>
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>

                    <BtnGrpLoanModalWrapper>
                      <h2>Initiate foreclosure for a chance to collect penalty fees.</h2>
                      <ModalButton
                        onClick={() => confirm('Foreclose')}
                        btnColor='#234566'
                        backgroundColor='#EAEAEA'
                      >
                        Initiate Foreclosure
                        <span></span>
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>
                  </BtnGrpLoanModal>
                ) : status === statuses['At_Risk'].status ? (
                  <BtnGrpLoanModal>
                    <BtnGrpLoanModalWrapper>
                      <h2>
                        Available Interest: {roundBasedOnUnit(interestPaid, collateralTypeName)}{' '}
                        {gweiOrEther(interestPaid, collateralTypeName)}
                      </h2>
                      <ModalButton
                        onClick={() => confirm('WithdrawInterest')}
                        btnColor='#234566'
                        backgroundColor='#EAEAEA'
                        display={!isShareholder ? 'none' : ''}
                      >
                        Withdraw Interest
                        <span></span>
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>

                    <BtnGrpLoanModalWrapper>
                      <h2>You can instantly foreclose this loan and collect penalty fees.</h2>
                      <ModalButton
                        onClick={() => confirm('Foreclose')}
                        btnColor='#234566'
                        backgroundColor='#EAEAEA'
                      >
                        Instantly Foreclose
                        <span></span>
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>
                  </BtnGrpLoanModal>
                ) : status === statuses['Foreclosing'].status ? (
                  <BtnGrpLoanModal>
                    <BtnGrpLoanModalWrapper>
                      <h2>
                        Available Interest: {roundBasedOnUnit(interestPaid, collateralTypeName)}{' '}
                        {gweiOrEther(interestPaid, collateralTypeName)}
                      </h2>
                      <ModalButton
                        onClick={() => confirm('WithdrawInterest')}
                        btnColor='#234566'
                        backgroundColor='#EAEAEA'
                        display={!isShareholder ? 'none' : ''}
                      >
                        Withdraw Interest
                        <span></span>
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>

                    <BtnGrpLoanModalWrapper>
                      <h2>
                        Blocks left to foreclose:{' '}
                        {!canBeForeclosed ? `${blocksUntilForeclosure}` : '0'}
                      </h2>
                      <ModalButton
                        onClick={() => confirm('Foreclose')}
                        btnColor='#234566'
                        backgroundColor='#EAEAEA'
                        disabled={!canBeForeclosed}
                      >
                        {/* {loanId === 20 ? console.log(!canBeForeclosed, blocksUntilForeclosure) : ''} */}
                        Instantly Foreclose
                        <span></span>
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>
                  </BtnGrpLoanModal>
                ) : status === statuses['Foreclosed'].status ? (
                  <BtnGrpLoanModalWrapper>
                    <h2>
                      Available Interest: {roundBasedOnUnit(interestPaid, collateralTypeName)}{' '}
                      {gweiOrEther(interestPaid, collateralTypeName)}
                    </h2>
                    <ModalButton
                      onClick={() => confirm('WithdrawInterest')}
                      btnColor='#234566'
                      backgroundColor='#EAEAEA'
                    >
                      Withdraw Interest
                      <span></span>
                    </ModalButton>
                  </BtnGrpLoanModalWrapper>
                ) : status === statuses['Early_closing'].status ? (
                  <BtnGrpLoanModalWrapper>
                    <h2>
                      Available Interest: {roundBasedOnUnit(interestPaid, collateralTypeName)}{' '}
                      {gweiOrEther(interestPaid, collateralTypeName)}
                    </h2>
                    <ModalButton
                      onClick={() => confirm('WithdrawInterest')}
                      btnColor='#234566'
                      backgroundColor='#EAEAEA'
                    >
                      Withdraw Interest
                      <span></span>
                    </ModalButton>
                  </BtnGrpLoanModalWrapper>
                ) : status === statuses['Closing'].status ? (
                  <BtnGrpLoanModalWrapper>
                    <h2>
                      Available Interest: {roundBasedOnUnit(interestPaid, collateralTypeName)}{' '}
                      {gweiOrEther(interestPaid, collateralTypeName)}
                    </h2>
                    <ModalButton
                      onClick={() => confirm('WithdrawInterest')}
                      btnColor='#234566'
                      backgroundColor='#EAEAEA'
                    >
                      Withdraw Interest
                      <span></span>
                    </ModalButton>
                  </BtnGrpLoanModalWrapper>
                ) : (
                  ''
                )}
              </BtnGrpLoanModal>
            </ModalContent>
          </ModalUserActions>
        </ModalActionsContent>
      </Modal>
    );
  };

  return path === 'borrow' ? borrowModal() : path === 'earn' ? earnModal() : false;
};

export default LoanModal;
