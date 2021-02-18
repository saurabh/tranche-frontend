import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
// import { confirmAlert } from 'react-confirm-alert';
// import { Spring } from 'react-spring/renderprops';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal } from 'assets';
import { trancheData } from 'config/constants';
import 'react-confirm-alert/src/react-confirm-alert.css';
import TradeForm from '../Form/ Trade';
import { gweiOrEther, roundBasedOnUnit, roundNumber } from 'utils';
import {
  fromWei,
  getTrancheParameters,
  getLoansAccruedInterest,
  collectLoansAccruedInterest,
  sendValueToTranche
} from 'services/contractMethods';
import {
  ModalHeader,
  ModalContent,
  BtnGrpLoanModal,
  ModalButton,
  //   ConfirmAlertWrapper,
  //   ConfirmAlertBtnWrapper,
  BtnGrpLoanModalWrapper,
  ModalActionsContent,
  ModalActionDetails,
  ModalUserActions,
  ModalActionDetailsContent,
  LoanDetailsRow,
  LoanDetailsRowTitle,
  LoanDetailsRowValue
  // LoanDetailsMobile
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
// const AdjustPositionStyles = {
//   overlay: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     top: '0',
//     left: '0',
//     right: '0',
//     bottom: '0'
//   },
//   content: {
//     position: 'relative',
//     maxWidth: '831px',
//     width: '100%',
//     minHeight: '454px',
//     //minHeight: '326px',
//     height: 'auto',
//     border: 'none',
//     boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
//     borderRadius: '12px',
//     padding: '0',
//     top: '0',
//     left: '0',
//     right: '0',
//     bottom: '0'
//   }
// };

Modal.setAppElement('#root');

const TradeModal = ({
  // State Values
  path,
  modalIsOpen,
  hasAllowance,
  approveLoading,
  withdraw,
  hasBalance,
  availableAmount,
  trancheTokenBalance,
  withdrawableFunds,
  loansAccruedInterest,
  // Functions
  closeModal,
  earnAllowanceCheck,
  earnApproveContract,
  setLoansAccruedInterest,
  buySellTrancheTokens,
  withdrawFundsFromTranche,
  // API Values
  trancheId,
  trancheName,
  trancheType,
  trancheTokenAddress,
  amount,
  subscriber,
  cryptoType,
  rpbRate
}) => {
  const [buyToggle, setBuyToggle] = useState(0);
  const [sellToggle, setSellToggle] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const limit = 2;
  const [startIndex, setStartIndex] = useState(0);
  const [stopIndex, setStopIndex] = useState(limit - 1);
  let trancheTokens =
    trancheTokenBalance && trancheTokenBalance[trancheName]
      ? roundNumber(fromWei(trancheTokenBalance[trancheName]))
      : 0;

  const searchArr = (address) => trancheData.find((i) => i.address === address);

  useEffect(() => {
    const getTrancheLoans = async () => {
      try {
        if (trancheId !== undefined) {
          const trancheParams = await getTrancheParameters(trancheId);
          let totalLoansInTranche = parseInt(trancheParams.totalLoansInTranche);
          setMaxPages(Math.ceil(totalLoansInTranche / limit));
        }
      } catch (error) {
        console.error(error);
      }
    };

    getTrancheLoans();
  }, [trancheId]);

  const modalClose = () => {
    closeModal();
    setSellToggle(false);
    setBuyToggle(false);
  };

  const sellTranche = (i) => {
    setSellToggle(true);
  };

  const buyTranche = (i) => {
    setBuyToggle(true);
  };

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    const newStartIndex = page * limit - limit;
    const newStopIndex = page * limit - 1;
    setStartIndex(newStartIndex);
    setStopIndex(newStopIndex);
    const result = await getLoansAccruedInterest(trancheId, newStartIndex, newStopIndex);
    setLoansAccruedInterest(fromWei(result));
  };

  const handleInterestWithdraw = async () => {
    try {
      await collectLoansAccruedInterest(trancheId, startIndex, stopIndex);
      const result = await getLoansAccruedInterest(trancheId, startIndex, stopIndex);
      setLoansAccruedInterest(fromWei(result));
    } catch (error) {
      console.error(error);
    }
  };

  const tradeModal = () => {
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
          <h2>{buyToggle ? 'Buy Eth' : sellToggle ? 'Sell ETH' : ''} TRANCHE A</h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>

        <ModalActionsContent>
          <ModalActionDetails>
            <ModalActionDetailsContent trade={true}>
              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle>Asset Value</LoanDetailsRowTitle>

                <LoanDetailsRowValue></LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle>Return per Block</LoanDetailsRowTitle>

                <LoanDetailsRowValue>
                  {roundBasedOnUnit(rpbRate, cryptoType)} {gweiOrEther(rpbRate, cryptoType)}
                </LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle>Liquidity</LoanDetailsRowTitle>

                <LoanDetailsRowValue></LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle>APY</LoanDetailsRowTitle>

                <LoanDetailsRowValue></LoanDetailsRowValue>
              </LoanDetailsRow>
            </ModalActionDetailsContent>
          </ModalActionDetails>
          {sellToggle || buyToggle ? (
            <TradeForm
              sellToggle={sellToggle}
              buyToggle={buyToggle}
              trancheType={trancheType}
              hasAllowance={hasAllowance}
              earnAllowanceCheck={earnAllowanceCheck}
              approveLoading={approveLoading}
              earnApproveContract={earnApproveContract}
              buySellTrancheTokens={buySellTrancheTokens}
            />
          ) : (
            <ModalUserActions>
              <ModalContent>
                <BtnGrpLoanModal>
                  <BtnGrpLoanModalWrapper>
                    <h2>
                      {trancheType === 'TRANCHE_A' && amount === subscriber
                        ? 'Tranche A is oversubscribed and there are no availble allocations'
                        : trancheType === 'TRANCHE_B'
                        ? 'The interest that flows into Tranche B is split between all Tranche B holders'
                        : !hasBalance
                        ? `You don't have enough ${cryptoType} for this action.`
                        : `There are ${availableAmount} Tranche A tokens available for purchase`}
                    </h2>
                    <ModalButton
                      trade={true}
                      onClick={() => buyTranche(0)}
                      btnColor='#FFFFFF'
                      backgroundColor='#2ECC71'
                      disabled={!hasBalance || amount === subscriber}
                    >
                      BUY {trancheType === 'TRANCHE_A' ? 'TRANCHE A' : 'TRANCHE B'}
                      <span></span>
                    </ModalButton>
                  </BtnGrpLoanModalWrapper>

                  <BtnGrpLoanModalWrapper>
                    <h2>
                      You have {trancheTokens}{' '}
                      {trancheType === 'TRANCHE_A' ? 'TRANCHE A' : 'TRANCHE B'} tokens available to
                      sell
                    </h2>
                    <ModalButton
                      trade={true}
                      // disabled={true}
                      onClick={() => sellTranche(0)}
                      btnColor='#FFFFFF'
                      backgroundColor='#845AD9'
                    >
                      SELL {trancheType === 'TRANCHE_A' ? 'TRANCHE A' : 'TRANCHE B'}
                      <span></span>
                    </ModalButton>
                  </BtnGrpLoanModalWrapper>

                  {searchArr(trancheTokenAddress) && (
                    <BtnGrpLoanModalWrapper>
                      <h2>Available Tranche Dividends: {roundNumber(withdrawableFunds)}</h2>
                      <ModalButton
                        trade={true}
                        onClick={() => withdrawFundsFromTranche()}
                        btnColor='#FFFFFF'
                        backgroundColor='#845AD9'
                      >
                        WIthdraw
                        <span></span>
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>
                  )}
                </BtnGrpLoanModal>
              </ModalContent>
            </ModalUserActions>
          )}
        </ModalActionsContent>
      </Modal>
    );
  };

  const withdrawModal = () => {
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
          <h2>{buyToggle ? 'Buy Eth' : sellToggle ? 'Sell ETH' : ''} TRANCHE A</h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>

        <ModalActionsContent>
          <ModalActionDetails>
            <ModalActionDetailsContent trade={true}>
              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle>Asset Value</LoanDetailsRowTitle>

                <LoanDetailsRowValue></LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle>Return per Block</LoanDetailsRowTitle>

                <LoanDetailsRowValue>
                  {roundBasedOnUnit(rpbRate, cryptoType)} {gweiOrEther(rpbRate, cryptoType)}
                </LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle>Liquidity</LoanDetailsRowTitle>

                <LoanDetailsRowValue></LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle>APY</LoanDetailsRowTitle>

                <LoanDetailsRowValue></LoanDetailsRowValue>
              </LoanDetailsRow>
            </ModalActionDetailsContent>
          </ModalActionDetails>
          <ModalUserActions>
            <ModalContent>
              <BtnGrpLoanModal>
                <BtnGrpLoanModalWrapper>
                  <h2>
                    Total Interest accrued inside Tranche Loans: {roundNumber(loansAccruedInterest)}
                  </h2>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  <ModalButton
                    trade={true}
                    onClick={() => handleInterestWithdraw()}
                    btnColor='#234566'
                    backgroundColor='#EAEAEA'
                    disabled={!hasBalance || amount === subscriber}
                  >
                    Withdraw Interest
                    <span></span>
                  </ModalButton>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === maxPages}
                  >
                    &gt;
                  </button>
                  <h2>
                    {currentPage} / {maxPages}
                  </h2>
                </BtnGrpLoanModalWrapper>

                <BtnGrpLoanModalWrapper>
                  <h2>Distribute Loan Interests to Tranches</h2>
                  <ModalButton
                    trade={true}
                    onClick={() => sendValueToTranche(trancheId)}
                    backgroundColor='#0A66E1'
                    btnColor='#FFFFFF'
                  >
                    Distribute protocol
                    <span></span>
                  </ModalButton>
                </BtnGrpLoanModalWrapper>
              </BtnGrpLoanModal>
            </ModalContent>
          </ModalUserActions>
        </ModalActionsContent>
      </Modal>
    );
  };

  return path === 'earn' && !withdraw
    ? tradeModal()
    : path === 'earn' && withdraw
    ? withdrawModal()
    : '';
};

export default TradeModal;
