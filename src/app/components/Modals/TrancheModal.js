import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { trancheMarketsToggle } from "redux/actions/tableData";
import { CloseModal, CloseModalWhite } from 'assets';

// import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  ModalHeader,
  ModalMarketWrapper,
  ModalMarketWrapperBtn,
} from './styles/ModalsComponents';
import { ModeThemes } from 'config';
const TrancheMarketStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '2000',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    position: 'relative',
    maxWidth: '372px',
    maxHeight: '388px',
    width: '100%',
    minHeight: '366px',
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

Modal.setAppElement('#root');

const StakingModal = ({
  modalIsOpen,
  type,
  theme,
  // Functions
  trancheMarketsToggle,
  closeModal,
  // API Values,
}) => {
  const trancheMarketsToggling = () => {
    trancheMarketsToggle("aavePolygon");
    closeModal();
  }
  const TrancheMarket = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={TrancheMarketStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
      >
        <ModalHeader notFound ModalBackground={ModeThemes[theme].ModalBackground}>
          <button onClick={() => closeModal()}>
            <img src={theme === "light" ? CloseModal : CloseModalWhite}alt='' />
          </button>
        </ModalHeader>
          <ModalMarketWrapper ModalBackground={ModeThemes[theme].ModalBackground} ModalText={ModeThemes[theme].ModalText} linkColor={ModeThemes[theme].TrancheModalLinkColor} linkBackground={ModeThemes[theme].TrancheModalLinkBackground}>
              <div>
                <p>
                    Polygon Markets are AAVE’s first implementation on the Polygon network, a layer 2 solution that highly improves the scalability of the Ethereum network in terms of cost and speed. To access Polygon markets, you will need to move your assets to the Polygon side chain using the Polygon Bridge. After that, your transactions will cost near 0 and settle instantly.
                </p>
                <a
                    href='https://docs.tranche.finance/tranchefinance/tranche-app/tranche-on-polygon'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                     Learn More
                </a>
              </div>
            <ModalMarketWrapperBtn color='#4939D7'  ModalBackground={ModeThemes[theme].SelectedStaking}>
              <button onClick={() => trancheMarketsToggling("aavePolygon")}>
                Continue to Polygon/AAVE Markets
              </button>
            </ModalMarketWrapperBtn>
          </ModalMarketWrapper>
      </Modal>
    );
  };

  return TrancheMarket();
};


const mapStateToProps = (state) => ({
    theme: state.theme

});

export default connect(mapStateToProps, { trancheMarketsToggle })(StakingModal);