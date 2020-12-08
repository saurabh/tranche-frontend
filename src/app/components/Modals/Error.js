
import React, { useState } from 'react';
import Modal from 'react-modal';

import {
  ModalHeader,
  ModalTextConfirm,
  ModalTextConfirmBtn,
  ModalTextConfirmBtnWrapper
} from './styles/ModalsComponents';

import { CloseModal } from 'assets';
const ErrorModalStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    overflowY: 'scroll'
  },
  content: {
    position: 'absolute',
    maxWidth: '831px',
    width: '100%',
    minHeight: '220px',
    border: 'none',
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    padding: '0',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '700px',
    overlfow: 'scroll'
  }
};

Modal.setAppElement('#root');

const ErrorModal = () => {
  

  const modalClose = (step = 'notFirst') => {
    if(step === 'first'){
      closeModal();
      toggleEarning(false);
    }
    else{
      closeModal();
    }
  };
  const EarningHandler = () => {
    toggleEarning(true);
    changeOwnAllFilter('own');
    closeModal();
  };

  const ErrorModalHandler = ({
    openModal,
    closeModal
  }) => {
    return (
      <div className="earningModal">
          <Modal
            isOpen={openModal}
            onRequestClose={closeModal}
            style={ErrorModalStyles}
            shouldCloseOnOverlayClick={false}
            contentLabel='Error'
          >
            <ModalHeader earning>
              <h2>
                SERVER DOWN
              </h2>
              <button onClick={() => modalClose('first')}>
                <img src={CloseModal} alt='' />
              </button>
            </ModalHeader>
            <ModalTextConfirm>
              <h2>
                Server is Down
              </h2>
            </ModalTextConfirm>
            <ModalTextConfirmBtnWrapper>
              <ModalTextConfirmBtn>
                REFRESH PAGE
              </ModalTextConfirmBtn>
            </ModalTextConfirmBtnWrapper>
          </Modal>
      </div>
    );
  };

  return ErrorModalHandler();
};

export default ErrorModal;