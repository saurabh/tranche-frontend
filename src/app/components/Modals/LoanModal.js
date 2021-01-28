import React, { useState } from 'react';
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert';
import { AdjustLoan } from 'app/components/Form/AdjustLoan';
import { Spring } from 'react-spring/renderprops';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { statuses, actionTypes } from 'config/constants';
import TradeForm from '../Form/ Trade';
import { roundNumber, gweiOrEther, roundBasedOnUnit } from 'utils';
import { CloseModal } from 'assets';
import 'react-confirm-alert/src/react-confirm-alert.css';

import {
  ModalHeader,
  ModalContent,
  BtnGrpLoanModal,
  ModalButton,
  ConfirmAlertWrapper,
  ConfirmAlertBtnWrapper,
  BtnGrpLoanModalWrapper,
  ModalActionsContent,
  ModalActionDetails,
  ModalUserActions,
  ModalActionDetailsContent,
  LoanDetailsRow,
  LoanDetailsRowTitle,
  LoanDetailsRowValue,
  BtnLoadingIcon,
  LoanDetailsMobile
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
    maxWidth: '831px',
    width: '100%',
    minHeight: '454px',
    //minHeight: '326px',
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

const LoanModal = ({
  // State Values
  path,
  modalIsOpen,
  approveLoading,
  hasBalance,
  hasAllowance,
  isShareholder,
  canBeForeclosed,
  blocksUntilForeclosure,
  accruedInterest,
  totalInterest,
  newCollateralRatio,
  setHasAllowance,
  setNewCollateralRatio,
  // Functions
  closeModal,
  approveContract,
  adjustLoan,
  calcNewCollateralRatio,
  closeLoan,
  approveLoan,
  withdrawInterest,
  forecloseLoan,
  sellToProtocol,
  // API Values
  loanId,
  status,
  pairId,
  contractAddress,
  remainingLoan,
  cryptoFromLenderName,
  collateralAmount,
  collateralTypeName,
  collateralRatio,
  interestPaid,
  APY,
  rpbRate
}) => {
  const [adjustPosition, adjustPositionToggle] = useState(false);
  const [isAdjustSelected, setIsAdjustSelected] = useState(false);
  const [sellAssetToggle, setSellAssetToggle] = useState(false);
  const [sellProtocol, setSellProtocol] = useState(false);
  const [offerMarket, setOfferMarket] = useState(false);
  const loanStatusPending = status === statuses['Pending'].status;

  const confirm = (type) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <Spring
            from={{
              transform: 'translate3d(0,-400px,0) scale(2)'
            }}
            to={{
              transform: 'translate3d(0,0px,0) scale(1)'
            }}
          >
            {(props) => (
              <ConfirmAlertWrapper style={props}>
                {type === 'Close' ? (
                  <h2>
                    Are you sure you want to return {remainingLoan + ' ' + cryptoFromLenderName}?
                  </h2>
                ) : (
                  <h2>{actionTypes[type].confirmationText}</h2>
                )}
                {/*{type === 'WithdrawInterest' && (
              <h5>Accrued Interest: {accruedInterest + ' ' + collateralTypeName}</h5>
            )}*/}
                <ConfirmAlertBtnWrapper>
                  <ModalButton
                    onClick={onClose}
                    btnColor='rgba(35,69,102,0.7)'
                    backgroundColor='#EAEAEA'
                  >
                    No
                  </ModalButton>
                  <ModalButton
                    btnColor='rgba(35,69,102,0.7)'
                    backgroundColor='#EAEAEA'
                    confirmBtn={true}
                    onClick={() => {
                      controlAction(type, onClose);
                    }}
                  >
                    Yes
                  </ModalButton>
                </ConfirmAlertBtnWrapper>
              </ConfirmAlertWrapper>
            )}
          </Spring>
        );
      }
    });
  };

  const controlAction = (type, onClose) => {
    if (type === actionTypes['Cancel'].name || type === actionTypes['Close'].name) {
      closeLoan();
      closeModal();
      onClose();
    } else if (type === actionTypes['Approve'].name) {
      approveLoan();
      closeModal();
      onClose();
    } else if (type === actionTypes['WithdrawInterest'].name) {
      withdrawInterest();
      closeModal();
      onClose();
    } else if (type === actionTypes['Foreclose'].name) {
      forecloseLoan();
      closeModal();
      onClose();
    }
  };

  const modalClose = () => {
    closeModal();
    adjustPositionToggle(false);
    setIsAdjustSelected(false);
    setSellAssetToggle(false);
    setSellProtocol(false); 
    setOfferMarket(false);
    setNewCollateralRatio(0);
  };

  const sellAsset = () =>{
    setSellAssetToggle(true);
  }

  const borrowModal = () => {
    return (
      <div>
        {!adjustPosition ? (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={FirstCustomStyles}
            closeTimeoutMS={200}
            shouldCloseOnOverlayClick={false}
            contentLabel='Adjust'
          >
            <ModalHeader>
              <h2>
                {status === statuses['Pending'].status
                  ? 'Manage Loan Request'
                  : status === statuses['Under_Collateralized'].status
                  ? 'Manage Loan Position'
                  : 'Manage Loan'}
              </h2>
              <button onClick={() => modalClose()}>
                <img src={CloseModal} alt='' />
              </button>
            </ModalHeader>

            <ModalActionsContent>
              <ModalActionDetails>
                <ModalActionDetailsContent>
                  <LoanDetailsRow>
                    <LoanDetailsRowTitle>Loan amount</LoanDetailsRowTitle>

                    <LoanDetailsRowValue>
                      {remainingLoan} {cryptoFromLenderName}
                    </LoanDetailsRowValue>
                  </LoanDetailsRow>

                  <LoanDetailsRow>
                    <LoanDetailsRowTitle>Collateral amount</LoanDetailsRowTitle>

                    <LoanDetailsRowValue>
                      {roundNumber(collateralAmount)} {collateralTypeName}
                    </LoanDetailsRowValue>
                  </LoanDetailsRow>

                  <LoanDetailsRow>
                    <LoanDetailsRowTitle>Collateral ratio</LoanDetailsRowTitle>

                    <LoanDetailsRowValue>{collateralRatio}%</LoanDetailsRowValue>
                  </LoanDetailsRow>

                  <LoanDetailsRow>
                    <LoanDetailsRowTitle>Rpb</LoanDetailsRowTitle>

                    <LoanDetailsRowValue>
                      {roundBasedOnUnit(rpbRate, collateralTypeName)}{' '}
                      {gweiOrEther(rpbRate, collateralTypeName)}
                    </LoanDetailsRowValue>
                  </LoanDetailsRow>

                  <LoanDetailsRow>
                    <LoanDetailsRowTitle>APY</LoanDetailsRowTitle>

                    <LoanDetailsRowValue>{APY}%</LoanDetailsRowValue>
                  </LoanDetailsRow>

                  {/*<div>
                    <h2>
                      <span>APY</span>
                    </h2>
                    <h2>
                      {interestPaid} {collateralTypeName}
                    </h2>
                  </div>*/}
                </ModalActionDetailsContent>
              </ModalActionDetails>

              <ModalUserActions>
                <ModalContent>
                 
                  <BtnGrpLoanModal>
                    <BtnGrpLoanModalWrapper>
                      {status === statuses['Under_Collateralized'].status ? (
                        <h2>
                          Your loan is undercollateralized, add collateral to avoid foreclosure.
                        </h2>
                      ) : (
                        <h2>
                          Increase or decrease your collateral amount based on market conditions.
                        </h2>
                      )}

                      <ModalButton
                        disabled={loanStatusPending}
                        onClick={() => adjustPositionToggle(true)}
                        grayBtn={true}
                        backgroundColor='#EAEAEA'
                        btnColor='#234566'
                      >
                        Adjust Collateral
                        <span></span>
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>

                    <BtnGrpLoanModalWrapper>
                      {status === statuses['Pending'].status ? (
                        <>
                          <h2>Cancel this loan request</h2>
                          <ModalButton
                            onClick={() => confirm('Cancel')}
                            backgroundColor='#0A66E1'
                            btnColor='#FFFFFF'
                          >
                            Cancel Loan
                          </ModalButton>
                        </>
                      ) : (
                        <>
                          <h2>
                            {!hasBalance
                              ? `You don't have enough ${cryptoFromLenderName} for this action.`
                              : 'Return the loan amount and pay outstanding interest.'}
                          </h2>
                          <ModalButton
                            onClick={
                              hasAllowance
                                ? () => confirm('Close')
                                : () => approveContract(pairId, remainingLoan.toString())
                            }
                            backgroundColor='#0A66E1'
                            btnColor='#FFFFFF'
                            loading={!hasAllowance && approveLoading ? 'true' : ''}
                            disabled={!hasBalance}
                          >
                            {!hasAllowance && !approveLoading
                              ? 'Approve'
                              : hasAllowance && !approveLoading
                              ? 'Close Loan'
                              : ''}
                            {(!hasAllowance && !approveLoading) ||
                            (hasAllowance && !approveLoading) ? (
                              <span></span>
                            ) : (
                              ''
                            )}
                            {approveLoading ? (
                              <div className='btnLoadingIconWrapper'>
                                <div className='btnLoadingIconCut'>
                                  <BtnLoadingIcon loadingColor='#0A66E1'></BtnLoadingIcon>
                                </div>
                              </div>
                            ) : (
                              ''
                            )}
                          </ModalButton>
                          <h2 style={{ marginTop: '12px' }}>
                            {!hasAllowance && !approveLoading
                              ? 'This is 1 of 2 transactions required to close a loan.'
                              : ''}
                          </h2>
                        </>
                      )}
                    </BtnGrpLoanModalWrapper>
                  </BtnGrpLoanModal>
                  <LoanDetailsMobile>
                    <h2>Loan amount — <span>{remainingLoan} {cryptoFromLenderName}</span></h2>
                    <h2>Collateral amount — <span>{roundNumber(collateralAmount)} {collateralTypeName}</span></h2>
                    <h2>Collateral ratio — <span>{collateralRatio}%</span></h2>
                    <h2>Rpb — <span>{roundBasedOnUnit(rpbRate, collateralTypeName)} {gweiOrEther(rpbRate, collateralTypeName)}</span></h2>
                    <h2>APY — <span>{APY}%</span></h2>
                    <h2>Interest accrued — <span>{roundBasedOnUnit(interestPaid, collateralTypeName)} {gweiOrEther(interestPaid, collateralTypeName)}</span></h2>
                  </LoanDetailsMobile>
                </ModalContent>
              </ModalUserActions>
            </ModalActionsContent>
          </Modal>
        ) : (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={AdjustPositionStyles}
            closeTimeoutMS={200}
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
              // State Values
              isAdjustSelected={isAdjustSelected}
              adjustPositionToggle={adjustPositionToggle}
              approveLoading={approveLoading}
              hasAllowance={hasAllowance}
              newCollateralRatio={newCollateralRatio}
              setIsAdjustSelected={setIsAdjustSelected}
              setNewCollateralRatio={setNewCollateralRatio}
              setHasAllowance={setHasAllowance}
              // Functions
              approveContract={approveContract}
              adjustLoan={adjustLoan}
              calcNewCollateralRatio={calcNewCollateralRatio}
              // API Values
              loanId={loanId}
              pairId={pairId}
              remainingLoan={remainingLoan}
              cryptoFromLenderName={cryptoFromLenderName}
              collateralAmount={collateralAmount}
              collateralTypeName={collateralTypeName}
              collateralRatio={collateralRatio}
            />
            <LoanDetailsMobile>
              <h2>Loan amount — <span>{remainingLoan} {cryptoFromLenderName}</span></h2>
              <h2>Collateral amount — <span>{roundNumber(collateralAmount)} {collateralTypeName}</span></h2>
              <h2>Collateral ratio — <span>{collateralRatio}%</span></h2>
              <h2>NEW COLLATERALIZATION RATIO — <span>{newCollateralRatio}%</span></h2>
            </LoanDetailsMobile>
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
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
      >
        <ModalHeader>
          <h2>
            {status === statuses['Pending'].status ? 'Review Loan Request' : (status === statuses['Active'].status && sellAssetToggle) ? "SELL ASSET" : 'Manage Earning Asset'}
          </h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>

        <ModalActionsContent>
          <ModalActionDetails>
            <ModalActionDetailsContent row4={status !== statuses['Pending'].status}>
              <LoanDetailsRow>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  Loan amount
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>
                  {remainingLoan} {cryptoFromLenderName}
                </LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  Collateral amount
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>
                  {roundNumber(collateralAmount)} {collateralTypeName}
                </LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  Collateral ratio
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>{collateralRatio}%</LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  Rpb
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>
                  {roundBasedOnUnit(rpbRate, collateralTypeName)}{' '}
                  {gweiOrEther(rpbRate, collateralTypeName)}
                </LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  APY
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>{APY}%</LoanDetailsRowValue>
              </LoanDetailsRow>

              {status !== statuses['Pending'].status ? (
                <LoanDetailsRow>
                  <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                    Interest accrued
                  </LoanDetailsRowTitle>

                  <LoanDetailsRowValue>
                    {roundBasedOnUnit(interestPaid, collateralTypeName)}{' '}
                    {gweiOrEther(interestPaid, collateralTypeName)}
                  </LoanDetailsRowValue>
                </LoanDetailsRow>
              ) : (
                ''
              )}
            </ModalActionDetailsContent>
          </ModalActionDetails>
          
          { status === statuses['Active'].status && sellAssetToggle  && (sellProtocol || offerMarket) ? 
            <ModalUserActions form>
              <TradeForm sellProtocol={sellProtocol} offerMarket={offerMarket} sellToProtocol={sellToProtocol} />
            </ModalUserActions> :

          <ModalUserActions>
            <ModalContent>
              <BtnGrpLoanModal>
                {status === statuses['Pending'].status ? (
                  <BtnGrpLoanModalWrapper>
                    <h2>
                      {!hasBalance
                        ? `You don't have enough ${cryptoFromLenderName} for this action.`
                        : `You are lending ${remainingLoan + ' ' + cryptoFromLenderName} backed by a
                      collateral ratio of ${collateralRatio}%.`}
                    </h2>
                    <ModalButton
                      onClick={
                        hasAllowance
                          ? () => confirm('Approve')
                          : () => approveContract(pairId, remainingLoan.toString())
                      }
                      btnColor='#ffffff'
                      backgroundColor='#2ECC71'
                      loading={!hasAllowance && approveLoading ? 'true' : ''}
                      disabled={!hasBalance}
                    >
                      {!hasAllowance && !approveLoading
                        ? 'Approve'
                        : hasAllowance && !approveLoading
                        ? 'Accept loan Request'
                        : ''}
                      {(!hasAllowance && !approveLoading) || (hasAllowance && !approveLoading) ? (
                        <span></span>
                      ) : (
                        ''
                      )}
                      {approveLoading ? (
                        <div className='btnLoadingIconWrapper'>
                          <div className='btnLoadingIconCut'>
                            <BtnLoadingIcon loadingColor='#2ECC71'></BtnLoadingIcon>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </ModalButton>
                    <h2 style={{ marginTop: '12px' }}>
                      {!hasAllowance && !approveLoading
                        ? 'This is 1 of 2 transactions required to accept a loan request.'
                        : ''}
                    </h2>
                    {
                      hasAllowance && !approveLoading ?
                        <h2>
                          <span>Caution! </span>This is an illiquid transaction. You will not be able to withdraw your DAI until the borrower repays his loan or defaults.
                        </h2> : ""
                    }
                  </BtnGrpLoanModalWrapper>
                ) : status === statuses['Active'].status && !sellAssetToggle ? (
                  <BtnGrpLoanModalWrapper interest>
                    <h2>
                      Available Interest: <span>{roundBasedOnUnit(accruedInterest, collateralTypeName)}{' '}
                      {gweiOrEther(accruedInterest, collateralTypeName)}</span> 
                    </h2>
                    <ModalButton
                      onClick={() => confirm('WithdrawInterest')}
                      btnColor='#234566'
                      backgroundColor='#EAEAEA'
                    >
                      Withdraw Interest
                      <span></span>
                    </ModalButton>

                    <ModalButton
                      onClick={() => sellAsset()}
                      btnColor='#FFFFFF'
                      backgroundColor='#2ECC71'
                    >
                      Sell Asset
                      <span></span>
                    </ModalButton>

                  </BtnGrpLoanModalWrapper>
                ) : 

                status === statuses['Active'].status && sellAssetToggle  && (!sellProtocol && !offerMarket) ? (
                  <BtnGrpLoanModalWrapper trade>
                    <BtnGrpLoanModalWrapper>
                      <h2>
                        You can sell this asset to the protocol at a 5% discount
                      </h2>
                      <ModalButton
                        onClick={() => setSellProtocol(true)}
                        btnColor='#FFFFFF'
                        backgroundColor='#845AD9'
                      >
                        SELL TO PROTOCOL
                        <span></span>
                      </ModalButton>
                      <h2>Instant Sale</h2>
                    </BtnGrpLoanModalWrapper>


                    <BtnGrpLoanModalWrapper>
                      <h2>You can offer this asset to buyers on the open market</h2>
                      <ModalButton
                        onClick={() => setOfferMarket(true)}
                        btnColor='#FFFFFF'
                        backgroundColor='#2ECC71'
                      >
                        OFFER TO MARKET
                        <span></span>
                      </ModalButton>
                      <h2>Requires a purchaser</h2>
                    </BtnGrpLoanModalWrapper>

                  </BtnGrpLoanModalWrapper>
                ) :

                status === statuses['Under_Collateralized'].status ? (
                  <BtnGrpLoanModal>
                    {isShareholder && (
                      <BtnGrpLoanModalWrapper interest>
                        <h2>
                          Available Interest: {roundBasedOnUnit(accruedInterest, collateralTypeName)}{' '}
                          {gweiOrEther(accruedInterest, collateralTypeName)}
                        </h2>
                        <ModalButton
                          onClick={() => confirm('WithdrawInterest')}
                          btnColor='#234566'
                          backgroundColor='#EAEAEA'
                        >
                          Withdraw Interest
                          <span></span>
                        </ModalButton>
                      </BtnGrpLoanModalWrapper>
                    )}

                    <BtnGrpLoanModalWrapper>
                      <h2>Initiate foreclosure for a chance to collect penalty fees.</h2>
                      <ModalButton
                        onClick={() => confirm('Foreclose')}
                        btnColor='#234566'
                        backgroundColor='#EAEAEA'
                      >
                        Initiate Foreclosure
                        <span></span>
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>
                  </BtnGrpLoanModal>
                ) : status === statuses['At_Risk'].status ? (
                  <BtnGrpLoanModal>
                    {isShareholder && (
                      <BtnGrpLoanModalWrapper interest>
                        <h2>
                          Available Interest: <span>{roundBasedOnUnit(accruedInterest, collateralTypeName)}{' '}
                          {gweiOrEther(accruedInterest, collateralTypeName)}</span> 
                        </h2>
                        <ModalButton
                          onClick={() => confirm('WithdrawInterest')}
                          btnColor='#234566'
                          backgroundColor='#EAEAEA'
                        >
                          Withdraw Interest
                          <span></span>
                        </ModalButton>
                      </BtnGrpLoanModalWrapper>
                    )}

                    <BtnGrpLoanModalWrapper>
                      <h2>You can instantly foreclose this loan and collect penalty fees.</h2>
                      <ModalButton
                        onClick={() => confirm('Foreclose')}
                        btnColor='#234566'
                        backgroundColor='#EAEAEA'
                      >
                        Instantly Foreclose
                        <span></span>
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>
                  </BtnGrpLoanModal>
                ) : status === statuses['Foreclosing'].status ? (
                  <BtnGrpLoanModal>
                    {isShareholder && (
                      <BtnGrpLoanModalWrapper interest>
                        <h2>
                          Available Interest: <span>{roundBasedOnUnit(accruedInterest, collateralTypeName)}{' '}
                          {gweiOrEther(accruedInterest, collateralTypeName)}</span> 
                        </h2>
                        <ModalButton
                          onClick={() => confirm('WithdrawInterest')}
                          btnColor='#234566'
                          backgroundColor='#EAEAEA'
                        >
                          Withdraw Interest
                          <span></span>
                        </ModalButton>
                      </BtnGrpLoanModalWrapper>
                    )}

                    <BtnGrpLoanModalWrapper>
                      <h2>
                        Blocks left to foreclose:{' '}
                        {!canBeForeclosed ? `${blocksUntilForeclosure}` : '0'}
                      </h2>
                      <ModalButton
                        onClick={() => confirm('Foreclose')}
                        btnColor='#234566'
                        backgroundColor='#EAEAEA'
                        disabled={!canBeForeclosed}
                      >
                        {/* {loanId === 20 ? console.log(!canBeForeclosed, blocksUntilForeclosure) : ''} */}
                        Instantly Foreclose
                        <span></span>
                      </ModalButton>
                    </BtnGrpLoanModalWrapper>
                  </BtnGrpLoanModal>
                ) : status === statuses['Foreclosed'].status ? (
                  <BtnGrpLoanModalWrapper interest>
                    <h2>
                      Available Interest: <span>{roundBasedOnUnit(accruedInterest, collateralTypeName)}{' '}
                      {gweiOrEther(accruedInterest, collateralTypeName)}</span> 
                    </h2>
                    <ModalButton
                      onClick={() => confirm('WithdrawInterest')}
                      btnColor='#234566'
                      backgroundColor='#EAEAEA'
                    >
                      Withdraw Interest
                      <span></span>
                    </ModalButton>
                  </BtnGrpLoanModalWrapper>
                ) : status === statuses['Early_closing'].status ? (
                  <BtnGrpLoanModalWrapper interest>
                    <h2>
                      Available Interest: <span>{roundBasedOnUnit(accruedInterest, collateralTypeName)}{' '}
                      {gweiOrEther(accruedInterest, collateralTypeName)}</span> 
                    </h2>
                    <ModalButton
                      onClick={() => confirm('WithdrawInterest')}
                      btnColor='#234566'
                      backgroundColor='#EAEAEA'
                    >
                      Withdraw Interest
                      <span></span>
                    </ModalButton>
                  </BtnGrpLoanModalWrapper>
                ) : status === statuses['Closing'].status ? (
                  <BtnGrpLoanModalWrapper interest>
                    <h2>
                      Available Interest: <span>{roundBasedOnUnit(accruedInterest, collateralTypeName)}{' '}
                      {gweiOrEther(accruedInterest, collateralTypeName)}</span> 
                    </h2>
                    <ModalButton
                      onClick={() => confirm('WithdrawInterest')}
                      btnColor='#234566'
                      backgroundColor='#EAEAEA'
                    >
                      Withdraw Interest
                      <span></span>
                    </ModalButton>
                  </BtnGrpLoanModalWrapper>
                ) : (
                  ''
                )}
              </BtnGrpLoanModal>
              <LoanDetailsMobile>
                <h2>Loan amount — <span>{remainingLoan} {cryptoFromLenderName}</span></h2>
                <h2>Collateral amount — <span>{roundNumber(collateralAmount)} {collateralTypeName}</span></h2>
                <h2>Collateral ratio — <span>{collateralRatio}%</span></h2>
                <h2>Rpb — <span>{roundBasedOnUnit(rpbRate, collateralTypeName)} {gweiOrEther(rpbRate, collateralTypeName)}</span></h2>
                <h2>APY — <span>{APY}%</span></h2>
                {
                  status !== statuses['Pending'].status ? 
                    <h2>Interest accrued — <span>{roundBasedOnUnit(interestPaid, collateralTypeName)} {gweiOrEther(interestPaid, collateralTypeName)}</span></h2>
                  
                  : ""
                }
              </LoanDetailsMobile>
            </ModalContent>
          </ModalUserActions>
        }
        </ModalActionsContent>
      </Modal>
    );
  };

  return path === 'borrow' ? borrowModal() : path === 'lend' ? earnModal() : false;
};

export default LoanModal;