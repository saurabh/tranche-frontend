import React, { useState } from 'react';
import Modal from 'react-modal';
// import { confirmAlert } from 'react-confirm-alert';
// import { Spring } from 'react-spring/renderprops';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { statuses  } from 'config/constants';
import { roundNumber } from 'utils';
import { CloseModal } from 'assets';
import 'react-confirm-alert/src/react-confirm-alert.css';
import TradeForm from '../Form/ Trade';

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
//   approveLoading,
//   hasBalance,
//   hasAllowance,
  isShareholder,
//   canBeForeclosed,
//   blocksUntilForeclosure,
//   accruedInterest,
//   totalInterest,
//   newCollateralRatio,
//   setHasAllowance,
  setNewCollateralRatio,
  // Functions
  closeModal,
//   approveContract,
//   adjustLoan,
//   calcNewCollateralRatio,
  closeLoan,
  approveLoan,
  withdrawInterest,
  forecloseLoan,
  // API Values
//   loanId,
  status,
//   pairId,
//   contractAddress,
  remainingLoan,
  cryptoFromLenderName,
  collateralAmount,
  collateralTypeName,
  collateralRatio,
  tradeType
//   interestPaid,
//   APY,
//   rpbRate
}) => {
const [buyToggle, setBuyToggle] = useState(0);
const [sellToggle, setSellToggle] = useState(0);

//   const [isAdjustSelected, setIsAdjustSelected] = useState(false);
//   const loanStatusPending = status === statuses['Pending'].status;

//   const confirm = (type) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <Spring
//             from={{
//               transform: 'translate3d(0,-400px,0) scale(2)'
//             }}
//             to={{
//               transform: 'translate3d(0,0px,0) scale(1)'
//             }}
//           >
//             {(props) => (
//               <ConfirmAlertWrapper style={props}>
//                 {type === 'Close' ? (
//                   <h2>
//                     Are you sure you want to return {remainingLoan + ' ' + cryptoFromLenderName}?
//                   </h2>
//                 ) : (
//                   <h2>{actionTypes[type].confirmationText}</h2>
//                 )}
//                 {/*{type === 'WithdrawInterest' && (
//               <h5>Accrued Interest: {accruedInterest + ' ' + collateralTypeName}</h5>
//             )}*/}
//                 <ConfirmAlertBtnWrapper>
//                   <ModalButton
//                     onClick={onClose}
//                     btnColor='rgba(35,69,102,0.7)'
//                     backgroundColor='#EAEAEA'
//                   >
//                     No
//                   </ModalButton>
//                   <ModalButton
//                     btnColor='rgba(35,69,102,0.7)'
//                     backgroundColor='#EAEAEA'
//                     confirmBtn={true}
//                     onClick={() => {
//                       controlAction(type, onClose);
//                     }}
//                   >
//                     Yes
//                   </ModalButton>
//                 </ConfirmAlertBtnWrapper>
//               </ConfirmAlertWrapper>
//             )}
//           </Spring>
//         );
//       }
//     });
//   };

//   const controlAction = (type, onClose) => {
//     if (type === actionTypes['Cancel'].name || type === actionTypes['Close'].name) {
//       closeLoan();
//       closeModal();
//       onClose();
//     } else if (type === actionTypes['Approve'].name) {
//       approveLoan();
//       closeModal();
//       onClose();
//     } else if (type === actionTypes['WithdrawInterest'].name) {
//       withdrawInterest();
//       closeModal();
//       onClose();
//     } else if (type === actionTypes['Foreclose'].name) {
//       forecloseLoan();
//       closeModal();
//       onClose();
//     }
//   };

  const modalClose = () => {
    closeModal();
    // adjustPositionToggle(false);
    // setIsAdjustSelected(false);
    setNewCollateralRatio(0);
    setSellToggle(false);
    setBuyToggle(false);
  };

  const sellTranche = (i) =>{
    setSellToggle(true);
  }
  const buyTranche = (i) =>{
    setBuyToggle(true);
  }

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
          <h2>
            {buyToggle ? "Buy Eth" : sellToggle ? "Sell ETH" : ""} TRANCHE A
          </h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>

        <ModalActionsContent>
          <ModalActionDetails>
            <ModalActionDetailsContent trade={true}>
              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  Loan amount
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>
                  {remainingLoan} {cryptoFromLenderName}
                </LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  Collateral amount
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>
                  {roundNumber(collateralAmount)} {collateralTypeName}
                </LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                  Collateral ratio
                </LoanDetailsRowTitle>

                <LoanDetailsRowValue>{collateralRatio}%</LoanDetailsRowValue>
              </LoanDetailsRow>


              {/* {status !== statuses['Pending'].status ? (
                <LoanDetailsRow>
                  <LoanDetailsRowTitle row4={status !== statuses['Pending'].status}>
                    Interest accrued
                  </LoanDetailsRowTitle>
                  <LoanDetailsRowValue>
                    {roundBasedOnUnit(totalInterest, collateralTypeName)}{' '}
                    {gweiOrEther(totalInterest, collateralTypeName)}
                  </LoanDetailsRowValue>
                </LoanDetailsRow>
              ) : (
                ''
              )} */}
            </ModalActionDetailsContent>
          </ModalActionDetails>
          {    sellToggle || buyToggle ? 
          
                <TradeForm  sellToggle={sellToggle} buyToggle={buyToggle} />

            :
              <ModalUserActions>
                <ModalContent>
                  {
                    isShareholder && tradeType === "sell" ?
                    <BtnGrpLoanModal>
                      <BtnGrpLoanModalWrapper>
                        <h2>
                        There are 1,501 Tranche A tokens available for purchase
                        </h2>
                        <ModalButton
                          trade={true}
                          onClick={() => buyTranche(0)}
                          btnColor='#FFFFFF'
                          backgroundColor='#2ECC71'
                        >
                            BUY TRANCHE A
                            <span></span>
                        </ModalButton>
                      </BtnGrpLoanModalWrapper>

                      <BtnGrpLoanModalWrapper>
                          <h2>You have 14,015 Tranche A tokens available to sell</h2>
                          <ModalButton
                            trade={true}
                            // disabled={true}
                            onClick={() => sellTranche(0)}
                            btnColor='#FFFFFF'
                            backgroundColor='#845AD9'
                          >
                          SELL TRANCHE A
                          <span></span>
                          </ModalButton>
                      </BtnGrpLoanModalWrapper>
                    </BtnGrpLoanModal> : ""
                  }
                    
                </ModalContent>
            </ModalUserActions>
          }
          
        </ModalActionsContent>
      </Modal>
    );
  };

  return path === 'earn' ? tradeModal() : "";
};

export default TradeModal;