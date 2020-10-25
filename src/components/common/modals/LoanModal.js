import React, { useState } from 'react';
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert';
import { AdjustLoan } from 'components/common/Form/AdjustLoan';
import { CloseModal } from 'assets';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { statuses, actionTypes } from 'config/constants';
import {
  ModalHeader,
  ModalContent,
  ModalContentDetails,
  BtnGrpLoanModal,
  ModalButton,
  ConfirmAlertWrapper,
  ConfirmAlertBtnWrapper
} from './ModalComponents';

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
    maxWidth: '392px',
    width: '100%',
    //height: '326px',
    height: 'auto',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0px 2px 4px rgba(99, 99, 99, 0.7)',
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
    maxWidth: '392px',
    width: '100%',
    //minHeight: '326px',
    height: 'auto',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0px 2px 4px rgba(99, 99, 99, 0.7)',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};

Modal.setAppElement('#root');

export default function LoanModal({
  modalIsOpen,
  closeModal,
  path,
  status,
  isShareholder,
  accruedInterest,
  canBeForeclosed,
  approveLoan,
  closeLoan,
  addCollateral,
  withdrawInterest,
  forecloseLoan,
  newCollateralRatio,
  calcNewCollateralRatio,
  interestPaid,
  collateralTypeName,
  remainingLoan, 
  collateralRatio, 
  collateralAmount,
  cryptoFromLenderName
}) {
  const [adjustPosition, adjustPositionToggle] = useState(false);
  const loanStatusPending = status === statuses['Pending'].status;

  const confirm = (type) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmAlertWrapper>
            <h2>{actionTypes[type].confirmationText}</h2>
            {/*{type === 'WithdrawInterest' && (
              <h5>Accrued Interest: {accruedInterest + ' ' + collateralTypeName}</h5>
            )}*/}
            <ConfirmAlertBtnWrapper>
              <ModalButton onClick={onClose}>No</ModalButton>
              <ModalButton
                btnColor={statuses['Active'].color}
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
              <h2>Manage Loan</h2>
              <button onClick={() => modalClose()}>
                <img src={CloseModal} alt='' />
              </button>
            </ModalHeader>
            <ModalContent>
            <ModalContentDetails>
            <div>
              <h2>
                <span>Loan amount</span>
              </h2>
              <h2>
                {remainingLoan} {cryptoFromLenderName}
              </h2>
            </div>

            <div>
              <h2>
                <span>Collateral amount</span>
              </h2>
              <h2>
                {collateralAmount} {collateralTypeName}
              </h2>
            </div>

            <div>
              <h2>
                <span>Collateral ratio</span>
              </h2>
              <h2>
                {collateralRatio}%
              </h2>
            </div>

            {/*<div>
              <h2>
                <span>APY</span>
              </h2>
              <h2>
                {interestPaid} {collateralTypeName}
              </h2>
            </div>*/}

            <div>
              <h2>
                <span>Interest accrued</span>
              </h2>
              <h2>
                {accruedInterest} {collateralTypeName}
              </h2>
            </div>
          </ModalContentDetails>
              <BtnGrpLoanModal>
                <ModalButton
                  disabled={loanStatusPending}
                  onClick={() => adjustPositionToggle(true)}
                >
                  Adjust Collateral
                </ModalButton>
                <ModalButton onClick={() => confirm('Close')}>Close Loan</ModalButton>
              </BtnGrpLoanModal>
            </ModalContent>
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
              collateralTypeName={collateralTypeName}
              addCollateral={addCollateral}
              newCollateralRatio={newCollateralRatio}
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
          <h2>Manage Earning Asset</h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>
        <ModalContent>
          <ModalContentDetails>
            <div>
              <h2>
                <span>Loan amount</span>
              </h2>
              <h2>
                {remainingLoan} {cryptoFromLenderName}
              </h2>
            </div>

            <div>
              <h2>
                <span>Collateral amount</span>
              </h2>
              <h2>
                {collateralAmount} {collateralTypeName}
              </h2>
            </div>

            <div>
              <h2>
                <span>Collateral ratio</span>
              </h2>
              <h2>
                {collateralRatio}%
              </h2>
            </div>

            {/*<div>
              <h2>
                <span>APY</span>
              </h2>
              <h2>
                {interestPaid} {collateralTypeName}
              </h2>
            </div>*/}

            <div>
              <h2>
                <span>Interest accrued</span>
              </h2>
              <h2>
                {accruedInterest} {collateralTypeName}
              </h2>
            </div>
          </ModalContentDetails>
          <BtnGrpLoanModal>
            {status === statuses['Pending'].status ? (
              <ModalButton
                onClick={() => confirm('Approve')}
                btnColor={statuses['Active'].color}
              >
                Approve Loan request
              </ModalButton>
            ) : status === statuses['Active'].status ? (
              <ModalButton
                onClick={() => confirm('WithdrawInterest')}
                btnColor={statuses['Foreclosing'].color}
              >
                Withdraw Interest
              </ModalButton>
            ) : status === statuses['Under_Collateralized'].status ? (
              <BtnGrpLoanModal>
                <ModalButton
                  onClick={() => confirm('WithdrawInterest')}
                  btnColor={statuses['Foreclosing'].color}
                  style={{ display: !isShareholder ? 'none' : '' }}
                >
                  Withdraw Interest
                </ModalButton>
                <ModalButton
                  onClick={() => confirm('Foreclose')}
                  btnColor={statuses['Foreclosing'].color}
                >
                  Foreclose Loan
                </ModalButton>
              </BtnGrpLoanModal>
            ) : status === statuses['At_Risk'].status ? (
              <BtnGrpLoanModal>
                <ModalButton
                  onClick={() => confirm('WithdrawInterest')}
                  btnColor={statuses['Foreclosed'].color}
                  style={{ display: !isShareholder ? 'none' : '' }}
                >
                  Withdraw Interest
                </ModalButton>
                <ModalButton
                  onClick={() => confirm('Foreclose')}
                  btnColor={statuses['Foreclosed'].color}
                >
                  Foreclose Loan
                </ModalButton>
              </BtnGrpLoanModal>
            ) : status === statuses['Foreclosing'].status ? (
              <BtnGrpLoanModal>
                <ModalButton
                  onClick={() => confirm('WithdrawInterest')}
                  btnColor={statuses['Foreclosed'].color}
                  style={{ display: !isShareholder ? 'none' : '' }}
                >
                  Withdraw Interest
                </ModalButton>
                <ModalButton
                  onClick={() => confirm('Foreclose')}
                  btnColor={statuses['Foreclosed'].color}
                  disabled={!canBeForeclosed}
                >
                  Foreclose Loan
                </ModalButton>
              </BtnGrpLoanModal>
            ) : status === statuses['Foreclosed'].status ? (
              <ModalButton
                onClick={() => confirm('WithdrawInterest')}
                btnColor={statuses['Foreclosed'].color}
              >
                Withdraw Interest
              </ModalButton>
            ) : status === statuses['Early_closing'].status ? (
              <ModalButton
                onClick={() => confirm('WithdrawInterest')}
                btnColor={statuses['Early_closing'].color}
              >
                Withdraw Interest
              </ModalButton>
            ) : status === statuses['Closing'].status ? (
              <ModalButton
                onClick={() => confirm('WithdrawInterest')}
                btnColor={statuses['Closing'].color}
              >
                Withdraw Interest
              </ModalButton>
            ) : (
              ''
            )}
          </BtnGrpLoanModal>
        </ModalContent>
      </Modal>
    );
  };

  return path === 'borrow' ? borrowModal() : path === 'earn' ? earnModal() : false;
}
