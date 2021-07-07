import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { trancheMarketsToggle } from "redux/actions/tableData";
import { CloseModal, CloseModalWhite, TrancheStake } from 'assets';

// import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  ModalHeader,
  ModalMarketWrapper,
  ModalMarketWrapperBtn,
  TrancheModalWrapper,
  TrancheModalHeader,
  TrancheModalContent,
  TrancheModalContentHeader,
  TrancheModalContentRow,
  TrancheModalFooter
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
const TrancheRewardsStyles = {
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
    maxWidth: '340px',
    maxHeight: '517px',
    width: '100%',
    minHeight: '517px',
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

const TrancheModal = ({
  modalIsOpen,
  type,
  theme,
  // Functions
  trancheMarketsToggle,
  closeModal,
  modalType
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
        portalClassName="TrancheMarketsModal"
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

  const TrancheRewards = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={TrancheRewardsStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
        portalClassName="TrancheRewardsModal"
      >

        <TrancheModalWrapper
          backgroundColor={ModeThemes[theme].ModalBackground}
        >
          <TrancheModalHeader color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
            <h2>TRANCHE REWARDS</h2>
            <ModalHeader tranche ModalBackground={ModeThemes[theme].ModalBackground}>
              <button onClick={() => closeModal()}>
                <img src={theme === "light" ? CloseModal : CloseModalWhite}alt='' />
              </button>
            </ModalHeader>
          </TrancheModalHeader>

          <TrancheModalContent>
            <TrancheModalContentHeader color={ModeThemes[theme].ModalTrancheTextColor}>
              <img src={TrancheStake} alt="img" />
              <h2>1005.125</h2>
              <h2>($865.50)</h2>
            </TrancheModalContentHeader>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>Wallet Balance </h2>
              <h2>900</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>Unclaimed Balance</h2>
              <h2>105.125</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow noBorder color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>Price</h2>
              <h2>$0.865</h2>
            </TrancheModalContentRow>
          </TrancheModalContent>

          <TrancheModalFooter color={ModeThemes[theme].ModalTrancheTextColor}>
            <button>
              Claim 105.125 SLICE 
            </button>
            <h2>
              Looking for Staking Rewards? <a href="/">Click Here</a>
            </h2>
          </TrancheModalFooter>


        </TrancheModalWrapper>

        
      </Modal>
    );
  };

  return modalType === "trancheRewards" ? TrancheRewards() : TrancheMarket();
};


const mapStateToProps = (state) => ({
    theme: state.theme

});

export default connect(mapStateToProps, { trancheMarketsToggle })(TrancheModal);