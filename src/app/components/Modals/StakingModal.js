import React from 'react';
import Modal from 'react-modal';
// import { confirmAlert } from 'react-confirm-alert';
// import { Spring } from 'react-spring/renderprops';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal } from 'assets';
import 'react-confirm-alert/src/react-confirm-alert.css';
import StakingForm from '../Form/Staking';
import {
  gweiOrEther,
  roundBasedOnUnit
  // roundNumber
} from 'utils';
import {
  ModalHeader,
  ModalActionsContent,
  ModalActionDetails,
  ModalActionDetailsContent,
  LoanDetailsRow,
  LoanDetailsRowTitle,
  LoanDetailsRowValue
} from './styles/ModalsComponents';

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
    maxWidth: '831px',
    width: '100%',
    minHeight: '554px',
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
  // State Values
  // path,
  modalIsOpen,
  modalType,
  isLPToken,
  hasAllowance,
  approveLoading,
  // Functions
  closeModal,
  stakingAllowanceCheck,
  stakingApproveContract,
  adjustStake,
  // API Values
  cryptoType,
  rpbRate
}) => {
  const modalClose = () => {
    closeModal();
  };

  const stakingModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={FirstCustomStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
      >
        <ModalHeader>
          <h2>{modalType ? 'STAKE SLICE TOKENS' : !modalType ? 'WITHDRAW SLICE TOKENS' : ''}</h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>

        <ModalActionsContent>
          <ModalActionDetails>
            <ModalActionDetailsContent trade={true}>
              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle>SLICE LOCKED</LoanDetailsRowTitle>

                <LoanDetailsRowValue></LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle>REWARDS PER BLOCK</LoanDetailsRowTitle>

                <LoanDetailsRowValue>
                  {roundBasedOnUnit(rpbRate, cryptoType)} {gweiOrEther(rpbRate, cryptoType)}
                </LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle>CURRENT RETURN PER SLICE</LoanDetailsRowTitle>

                <LoanDetailsRowValue></LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle>EST APY</LoanDetailsRowTitle>

                <LoanDetailsRowValue></LoanDetailsRowValue>
              </LoanDetailsRow>
            </ModalActionDetailsContent>
          </ModalActionDetails>
          <StakingForm
            modalType={modalType}
            hasAllowance={hasAllowance}
            approveLoading={approveLoading}
            isLPToken={isLPToken}
            stakingAllowanceCheck={stakingAllowanceCheck}
            stakingApproveContract={stakingApproveContract}
            adjustStake={adjustStake}
          />
        </ModalActionsContent>
      </Modal>
    );
  };
  return stakingModal();
};

export default StakingModal;
