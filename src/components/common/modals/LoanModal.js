import React, { useState } from 'react';
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert';
import { AdjustLoan } from 'components/common/Form/AdjustLoan'
import CloseModal from 'assets/images/svg/closeModal.svg';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { statuses } from 'config/constants';
import {
  ModalHeader,
  ModalContent,
  BtnGrpLoanModal,
  ModalButton,
  ConfirmAlertWrapper,
  ConfirmAlertBtnWrapper,
  ModalAdjustForm,
  ModalFormWrapper,
  ModalFormGrp,
  ModalFormLabel,
  ModalFormInput,
  ModalFormSubmit,
  ModalFormButton
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
    maxWidth: '292px',
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
    maxWidth: '292px',
    width: '100%',
    minHeight: '326px',
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
  approveLoan,
  closeLoan,
  addCollateral,
  newCollateralRatio,
  calcNewCollateralRatio
}) {
  const [adjustPosition, adjustPositionToggle] = useState(false);
  let ConfirmText =
    status === statuses["Pending"].status && path === 'borrow'
      ? 'Are you sure you want to cancel the loan request?'
      : status === statuses["Pending"].status && path === 'earn'
      ? 'Are you sure you want to approve this loan?'
      : status === statuses["Active"].status && path === 'borrow'
      ? 'Are you sure you want to close the loan?'
      : status === statuses["Active"].status && path === 'earn'
      ? 'Are you sure you want to withdraw interest?'
      : '';

  const confirm = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmAlertWrapper>
            <h2>{ConfirmText}</h2>
            <ConfirmAlertBtnWrapper>
              <ModalButton onClick={onClose}>No</ModalButton>
              <ModalButton
                btnColor={statuses["Active"].color}
                confirmBtn={true}
                onClick={() => {
                  controlAction(onClose);
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

  const controlAction = (onClose) => {
    if (status === 0 && path === 'borrow') {
      closeLoan();
      closeModal();
      onClose();
    } else if (status === 0 && path === 'earn') {
      approveLoan();
      closeModal();
      onClose();
    } else if (status === 1 && path === 'borrow') {
      closeLoan();
      closeModal();
      onClose();
    } else if (status === 1 && path === 'earn') {
      alert('Withdraw Interest');
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
              <h2>Adjust</h2>
              <button onClick={() => modalClose()}>
                <img src={CloseModal} alt='' />
              </button>
            </ModalHeader>
            <ModalContent>
              <BtnGrpLoanModal>
                <ModalButton onClick={() => adjustPositionToggle(true)}>
                  Adjust Collateral
                </ModalButton>
                <ModalButton onClick={() => confirm()}>Close Loan</ModalButton>
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
            <AdjustLoan addCollateral={addCollateral} newCollateralRatio={newCollateralRatio} calcNewCollateralRatio={calcNewCollateralRatio}/>
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
          <h2>Adjust</h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>
        <ModalContent>
          <BtnGrpLoanModal>
            {status === statuses["Pending"].status ? (
              <ModalButton
                onClick={() => confirm()}
                btnColor={statuses["Active"].color}
              >
                Active Loan
              </ModalButton>
            ) : status === statuses["Active"].status ? (
              <ModalButton
                onClick={() => confirm()}
                btnColor={statuses["Foreclosing"].color}
              >
                Withdraw Interest
              </ModalButton>
            ) : status === statuses["Under_Collateralized"].status ? (
              <BtnGrpLoanModal>
                <ModalButton
                  onClick={() => confirm()}
                  btnColor={statuses["Foreclosing"].color}
                >
                  Withdraw Interest
                </ModalButton>
                <ModalButton
                  onClick={() => confirm()}
                  btnColor={statuses["Foreclosing"].color}
                >
                  Foreclosing Loan
                </ModalButton>
              </BtnGrpLoanModal>
            ) : status === statuses["At_Risk"].status ? (
              <BtnGrpLoanModal>
                <ModalButton
                  onClick={() => confirm()}
                  btnColor={statuses["Foreclosed"].color}
                >
                  Withdraw Interest
                </ModalButton>
                <ModalButton
                  onClick={() => confirm()}
                  btnColor={statuses["Foreclosed"].color}
                >
                  Foreclosed Action
                </ModalButton>
              </BtnGrpLoanModal>
            ) : status === statuses["Foreclosed"].status ? (
              <ModalButton
                onClick={() => confirm()}
                btnColor={statuses["Foreclosed"].color}
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

  return path === 'borrow'
    ? borrowModal()
    : path === 'earn'
    ? earnModal()
    : false;
}
