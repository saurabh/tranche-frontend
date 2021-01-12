
import React  from 'react';
import Modal from 'react-modal';

import {
  ModalErrorWrapper,
  ModalTextConfirm,
  ModalTextConfirmBtn,
  ModalTextConfirmBtnWrapper
} from './styles/ModalsComponents';
import { serverDown } from 'config/message';


import { ServerError } from 'assets';
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

const ErrorModal = ({
  openModal,
  closeModal
}) => {
  
  const ErrorModalHandler = () => {
    return (
      <div className="errorModal">
          <Modal
            isOpen={openModal}
            onRequestClose={closeModal}
            style={ErrorModalStyles}
            shouldCloseOnOverlayClick={false}
            contentLabel='Error'
          >
            <ModalErrorWrapper>
              <div>
                <img src={ServerError} alt="error"/>
              </div>
              <ModalTextConfirm>
                <h2>
                  {serverDown}
                </h2>
              </ModalTextConfirm>
              <ModalTextConfirmBtnWrapper>
                <ModalTextConfirmBtn onClick={() => window.location.reload()} errorBtn={true}>
                  REFRESH PAGE
                </ModalTextConfirmBtn>
              </ModalTextConfirmBtnWrapper>
            </ModalErrorWrapper>
          </Modal>
      </div>
    );
  };

  return ErrorModalHandler();
};

export default ErrorModal;