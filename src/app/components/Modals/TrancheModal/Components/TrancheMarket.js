import React from 'react';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal, CloseModalWhite } from 'assets';
import { ModeThemes } from 'config/constants';
import { ModalHeader, ModalMarketWrapper, ModalMarketWrapperBtn, TrancheMarketStyles } from '../../styles/ModalsComponents';

export const TrancheMarket = ({ theme, txModalIsOpen, closeModal, trancheMarketsToggling }) => {
  return (
    <Modal
      isOpen={txModalIsOpen}
      onRequestClose={closeModal}
      style={TrancheMarketStyles}
      closeTimeoutMS={200}
      shouldCloseOnOverlayClick={false}
      contentLabel='Adjust'
      portalClassName='TrancheMarketsModal'
    >
      <ModalHeader notFound ModalBackground={ModeThemes[theme].ModalBackground}>
        <button onClick={() => closeModal()}>
          <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
        </button>
      </ModalHeader>
      <ModalMarketWrapper
        ModalBackground={ModeThemes[theme].ModalBackground}
        ModalText={ModeThemes[theme].ModalText}
        linkColor={ModeThemes[theme].TrancheModalLinkColor}
        linkBackground={ModeThemes[theme].TrancheModalLinkBackground}
      >
        <div>
          <p>
            Polygon Markets are AAVE’s first implementation on the Polygon network, a layer 2 solution that highly improves the scalability of the
            Ethereum network in terms of cost and speed. To access Polygon markets, you will need to move your assets to the Polygon side chain using
            the Polygon Bridge. After that, your transactions will cost near 0 and settle instantly.
          </p>
          <a href='https://docs.tranche.finance/tranchefinance/tranche-app/tranche-on-polygon' target='_blank' rel='noopener noreferrer'>
            Learn More
          </a>
        </div>
        <ModalMarketWrapperBtn color='#4939D7' ModalBackground={ModeThemes[theme].SelectedStaking}>
          <button onClick={() => trancheMarketsToggling('aavePolygon')}>Continue to Polygon/AAVE Markets</button>
        </ModalMarketWrapperBtn>
      </ModalMarketWrapper>
    </Modal>
  );
};
