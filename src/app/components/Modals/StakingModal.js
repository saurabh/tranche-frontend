import React, { useEffect, useState } from 'react';
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
  LoanDetailsRowValue,
  LoanDetailsMobile,
  StakingModalRow,
  StakingModalWrapper
} from './styles/ModalsComponents';

import {
  SummaryCardCounter,
  SummaryCardBtn
} from '../Summary/styles/SummaryComponents';

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
  summaryModal,
  // path,
  modalIsOpen,
  modalType,
  isLPToken,
  hasAllowance,
  approveLoading,
  tokenBalance,
  // Functions
  closeModal,
  openModal,
  stakingAllowanceCheck,
  stakingApproveContract,
  adjustStake,
  // API Values
  cryptoType,
  rpbRate
}) => {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });
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
        {
        !isDesktop && summaryModal ?
        <ModalActionsContent stakingMobile>
          <StakingModalWrapper>
            <StakingModalRow>
              <h2>Staked SLICE Tokens</h2>
              <h2>00.00</h2>
              <SummaryCardCounter stakingMobile>
                <SummaryCardBtn
                  stakingMobile
                    onClick={() => openModal(true, 1)}
                >+</SummaryCardBtn>
                <SummaryCardBtn
                  stakingMobile
                    onClick={() => openModal(false, 1)}
                >-</SummaryCardBtn>
              </SummaryCardCounter>
            </StakingModalRow>

            <StakingModalRow>
              <h2>Staked SLICE Tokens</h2>
              <h2>00.00</h2>
              <SummaryCardCounter stakingMobile>
                <SummaryCardBtn
                  stakingMobile
                    onClick={() => openModal(true, 2)}
                >+</SummaryCardBtn>
                <SummaryCardBtn
                  stakingMobile
                    onClick={() => openModal(false, 2)}
                >-</SummaryCardBtn>
              </SummaryCardCounter>
            </StakingModalRow>
          </StakingModalWrapper>
          <LoanDetailsMobile>
            <h2>
              SLICE LOCKED —{' '}
              {/* SLICE LOCKED — {roundBasedOnUnit(reward, 'SLICE')} {gweiOrEther(reward, 'SLICE')} */}
              <span>
              </span>
            </h2>
            <h2>
              REWARDS PER BLOCK —{' '}
              <span>
              </span>
            </h2>
          </LoanDetailsMobile>
        </ModalActionsContent> : 

          <ModalActionsContent stakingMobile>
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
              </ModalActionDetailsContent>
            </ModalActionDetails>
            <StakingForm
              modalType={modalType}
              hasAllowance={hasAllowance}
              approveLoading={approveLoading}
              isLPToken={isLPToken}
              tokenBalance={tokenBalance}
              // Functions
              stakingAllowanceCheck={stakingAllowanceCheck}
              stakingApproveContract={stakingApproveContract}
              adjustStake={adjustStake}
            />
            <LoanDetailsMobile>
            <h2>
              SLICE LOCKED —{' '}
              <span>
              </span>
            </h2>
            <h2>
              REWARDS PER BLOCK —{' '}
              <span>
              </span>
            </h2>
          </LoanDetailsMobile>
          </ModalActionsContent>
        }
      </Modal>
    );
  };
  return stakingModal();
};

export default StakingModal;
