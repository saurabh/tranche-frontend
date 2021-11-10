import React from 'react';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal, CloseModalWhite } from 'assets';
import { ModeThemes } from 'config/constants';
import { ModalHeader, ModalMarketWrapper, ModalMarketWrapperBtn, TrancheWFTMStyles, TrancheModalContent, TrancheModalWrapper } from '../../styles/ModalsComponents';

export const TrancheWFTM = ({ theme, txModalIsOpen, closeModal, trancheMarketsToggling }) => {
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
      <TrancheModalWrapper backgroundColor={ModeThemes[theme].ModalBackground} TrancheWFTM>

        <ModalHeader tranche ModalBackground={ModeThemes[theme].ModalBackground} enableModal>
          <button onClick={() => closeModal()}>
            <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
          </button>
        </ModalHeader>

        <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor} TrancheWFTM>

        </TrancheModalContent>

      </TrancheModalWrapper>
    </Modal>
  );
};
