import React, { useState } from 'react';
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert';
import { AdjustLoan } from 'components/common/Form/AdjustLoan';
import CloseModal from 'assets/images/svg/closeModal.svg';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { statuses } from 'config/constants';
import { confirmationTexts } from 'config/constants';
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
  approveLoan,
  closeLoan,
  addCollateral,
  withdrawInterest,
  forecloseLoan,
  newCollateralRatio,
  calcNewCollateralRatio
}) {
  const [adjustPosition, adjustPositionToggle] = useState(false);
  let ConfirmText;

  if (path === 'borrow') {
    ConfirmText =
      status === statuses['Pending'].status
        ? confirmationTexts["confirmCancel"]
        : status === statuses['Active'].status
        ? confirmationTexts["confirmClose"]
        : '';
  } else if (path === 'earn') {
    ConfirmText =
      status === statuses['Pending'].status
        ? confirmationTexts["confirmApprove"]
        : status === statuses['Active'].status
        ? confirmationTexts["confirmWithdraw"]
        : status === statuses['Under_Collateralized'].status ||
          status === statuses['At_Risk'].status
        ? confirmationTexts["confirmForeclose"]
        : status === statuses['Closing'].status
        ? confirmationTexts["confirmWithdraw"]
        : '';
  }

  const confirm = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmAlertWrapper>
            <h2>{ConfirmText}</h2>
            <ConfirmAlertBtnWrapper>
              <ModalButton onClick={onClose}>No</ModalButton>
              <ModalButton
                btnColor={statuses['Active'].color}
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
    if (
      path === 'borrow' &&
      (status === statuses['Pending'].status || status === statuses['Active'].status)
    ) {
      closeLoan();
      closeModal();
      onClose();
    } else if (path === 'earn' && status === statuses['Pending'].status) {
      approveLoan();
      closeModal();
      onClose();
    } else if (path === 'earn' && status === statuses['Active'].status) {
      withdrawInterest();
      closeModal();
      onClose();
    } else if (
      path === 'earn' &&
      (status === statuses['Under_Collateralized'].status ||
        status === statuses['At_Risk'].status)
    ) {
      forecloseLoan();
      closeModal();
      onClose();
    } else if (path === 'earn' && status === statuses['Closing'].status) {
      withdrawInterest();
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
            <AdjustLoan
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
          <h2>Adjust</h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>
        <ModalContent>
          <BtnGrpLoanModal>
            {status === statuses['Pending'].status ? (
              <ModalButton onClick={() => confirm()} btnColor={statuses['Active'].color}>
                Approve Loan
              </ModalButton>
            ) : status === statuses['Active'].status ? (
              <ModalButton
                onClick={() => confirm()}
                btnColor={statuses['Foreclosing'].color}
              >
                Withdraw Interest
              </ModalButton>
            ) : status === statuses['Under_Collateralized'].status ? (
              <BtnGrpLoanModal>
                <ModalButton
                  onClick={() => confirm()}
                  btnColor={statuses['Foreclosing'].color}
                >
                  Withdraw Interest
                </ModalButton>
                <ModalButton
                  onClick={() => confirm()}
                  btnColor={statuses['Foreclosing'].color}
                >
                  Foreclose Loan
                </ModalButton>
              </BtnGrpLoanModal>
            ) : status === statuses['At_Risk'].status ? (
              <BtnGrpLoanModal>
                <ModalButton
                  onClick={() => confirm()}
                  btnColor={statuses['Foreclosed'].color}
                >
                  Withdraw Interest
                </ModalButton>
                <ModalButton
                  onClick={() => confirm()}
                  btnColor={statuses['Foreclosed'].color}
                >
                  Foreclose Loan
                </ModalButton>
              </BtnGrpLoanModal>
            ) : status === statuses['Foreclosed'].status ? (
              <ModalButton
                onClick={() => confirm()}
                btnColor={statuses['Foreclosed'].color}
              >
                Withdraw Interest
              </ModalButton>
            ) : status === statuses['Early_closing'].status ? (
              <ModalButton
                onClick={() => confirm()}
                btnColor={statuses['Early_closing'].color}
              >
                Withdraw Interest
              </ModalButton>
            ) : status === statuses['Closing'].status ? (
              <ModalButton onClick={() => confirm()} btnColor={statuses['Closing'].color}>
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
