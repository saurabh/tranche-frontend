import React, { useState } from 'react';
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert';
import CloseModal from 'assets/images/svg/closeModal.svg';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { statuses } from '../../../config/constants';
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
  approveLoan
}) {
  const [adjustPosition, adjustPositionToggle] = useState(false);
  let ConfirmText =
    status === 0
      ? 'Are you sure you want to approve this loan?'
      : status === 1 && path === 'earn'
      ? 'Are you sure you want to withdraw interest?'
      : status === 1 && path === 'borrow'
      ? 'Are you sure you want to close the loan?'
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
                btnColor={statuses[1].color}
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
    if (status === 0) {
      approveLoan();
      closeModal();
      onClose();
    } else if (status === 1 && path === 'borrow') {
      alert('Close Loan');
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
            <ModalAdjustForm>
              <ModalFormWrapper>
                <ModalFormGrp>
                  <ModalFormLabel htmlFor='blockedInput'>LOCKED</ModalFormLabel>
                  <ModalFormInput
                    type='number'
                    step='0.0001'
                    id='blockedInput'
                  />
                  <h2>
                    INTEREST EARNED: <span>0.0000</span> ETH
                  </h2>
                </ModalFormGrp>
                <ModalFormGrp>
                  <ModalFormLabel htmlFor='blockedInput'>
                    EARNING PER BLOCK
                  </ModalFormLabel>
                  <ModalFormInput
                    type='number'
                    step='0.0001'
                    id='blockedInput'
                  />
                  <h2>
                    ANNUAL RETURN: <span>0.00%</span> APY
                  </h2>
                </ModalFormGrp>
              </ModalFormWrapper>
            </ModalAdjustForm>
            <ModalFormSubmit>
              <BtnGrpLoanModal>
                <ModalFormButton>CHANGE POSITION</ModalFormButton>
              </BtnGrpLoanModal>
            </ModalFormSubmit>
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
            {status === 0 ? (
              <ModalButton
                onClick={() => confirm()}
                btnColor={statuses[1].color}
              >
                Active Loan
              </ModalButton>
            ) : status === 1 ? (
              <ModalButton
                onClick={() => confirm()}
                btnColor={statuses[4].color}
              >
                Withdraw Interest
              </ModalButton>
            ) : status === 2 ? (
              <BtnGrpLoanModal>
                <ModalButton
                  onClick={() => confirm()}
                  btnColor={statuses[4].color}
                >
                  Withdraw Interest
                </ModalButton>
                <ModalButton
                  onClick={() => confirm()}
                  btnColor={statuses[4].color}
                >
                  Foreclosing Loan
                </ModalButton>
              </BtnGrpLoanModal>
            ) : status === 3 ? (
              <BtnGrpLoanModal>
                <ModalButton
                  onClick={() => confirm()}
                  btnColor={statuses[5].color}
                >
                  Withdraw Interest
                </ModalButton>
                <ModalButton
                  onClick={() => confirm()}
                  btnColor={statuses[5].color}
                >
                  Foreclosed Action
                </ModalButton>
              </BtnGrpLoanModal>
            ) : status === 4 ? (
              <ModalButton
                onClick={() => confirm()}
                btnColor={statuses[5].color}
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
