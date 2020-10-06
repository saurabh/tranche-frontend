import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CloseModal from 'assets/images/svg/closeModal.svg';
import { setBorrowedAskAmount, setCollateralAmount } from 'redux/actions/form';
import { loansFetchData } from 'redux/actions/loans';
import { submitValidations } from 'utils/validations'
import Modal from 'react-modal';
import { NewLoan } from 'components/common';
import { JFactorySetup, JPTSetup } from 'utils/contractConstructor';
import { isGreaterThan } from 'utils/helperFunctions';
import { JLoanTokenDeployerAddress } from 'config/ethereum';
import {
  ModalHeader
 } from './ModalComponents';

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
    maxWidth: '292px',
    width: '100%',
    minHeight: '326px',
    height: 'auto',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0px 2px 4px rgba(99, 99, 99, 0.7)',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};

const LoanModal = ({
  type,
  ethereum: { address, network, balance, wallet, web3, notify },
  form,
  setBorrowedAskAmount,
  setCollateralAmount,
  loansFetchData,
  openModal,
  closeModal
}) => {
  const JFactory = JFactorySetup(web3);
  const JPT = JPTSetup(web3);
  const toWei = web3.utils.toWei;
  const fromWei = web3.utils.fromWei;
  const [collateralAmountForInput, setCollateralAmountForInput] = useState(0);

  useEffect(() => {}, [address, network, balance, wallet, web3]);

  function HandleCloseModal() {
    closeModal();
  }
  
  const calcMinCollateralAmount = async (pairId, askAmount) => {
    try {
      const finalamount = toWei(askAmount);
      const result = await JFactory.methods
        .calcMinCollateralWithFeesAmount(pairId, finalamount)
        .call();
      setCollateralAmount(fromWei(result));
      setCollateralAmountForInput(parseFloat(fromWei(result)).toFixed(3))
    } catch (error) {
      console.error(error);
    }
  };

  const calcMaxBorrowedAmount = async (pairId, collAmount) => {
    try {
      const finalamount = toWei(collAmount);
      const result = await JFactory.methods
        .calcMaxStableCoinWithFeesAmount(pairId, finalamount)
        .call();
      setBorrowedAskAmount(parseFloat(fromWei(result)).toFixed(3));
    } catch (error) {
      console.error(error);
    }
  };

  const createNewEthLoan = async (
    pairId,
    borrowedAskAmount,
    rpbRate,
    collateralAmount
  ) => {
    try {
      await JFactory.methods
        .createNewEthLoan(pairId, borrowedAskAmount, rpbRate)
        .send({ value: collateralAmount, from: address })
        .on('transactionHash', (hash) => {
          notify.hash(hash);
        })
        .on('receipt', async () => {
          await loansFetchData({
            skip: 0,
            limit: 10000,
            filter: {
              type: null //ETH/JNT keep these in constant file
            }
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const createNewTokenLoan = async (
    pairId,
    borrowedAskAmount,
    rpbRate,
    collateralAmount
  ) => {
    try {
      let userAllowance = await JPT.methods
        .allowance(address, JLoanTokenDeployerAddress)
        .call();
      console.log(userAllowance, collateralAmount);
      if (isGreaterThan(collateralAmount, userAllowance)) {
        await JPT.methods
          .approve(JLoanTokenDeployerAddress, collateralAmount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          });
        await JFactory.methods
          .createNewTokenLoan(pairId, borrowedAskAmount, rpbRate)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          })
          .on('receipt', async () => {
            await loansFetchData({
              skip: 0,
              limit: 10000,
              filter: {
                type: null //ETH/JNT keep these in constant file
              }
            });
          });
      } else {
        await JFactory.methods
          .createNewTokenLoan(pairId, borrowedAskAmount, rpbRate)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          })
          .on('receipt', async () => {
            await loansFetchData({
              skip: 0,
              limit: 10000,
              filter: {
                type: null //ETH/JNT keep these in constant file
              }
            });
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    switch (type) {
      case 'new':
        async function createNewLoan() {
          try {
            const tempRpbRate = 10 ** 10;
            let {
              pairId,
              borrowedAskAmount,
              collateralAmount,
              rpbRate
            } = form.newLoan.values;
            // submitValidations(form.newLoan.values, form.newLoan.submitCheck);
            borrowedAskAmount = toWei(borrowedAskAmount);
            collateralAmount = toWei(collateralAmount);
            if (pairId === 0) {
              createNewEthLoan(
                pairId,
                borrowedAskAmount,
                tempRpbRate,
                collateralAmount
              );
            } else {
              createNewTokenLoan(
                pairId,
                borrowedAskAmount,
                tempRpbRate,
                collateralAmount
              );
            }
          } catch (error) {
            console.error(error);
          }
        }
        createNewLoan();
        HandleCloseModal();
        break;
      case 'adjust':
        break;
      default:
        break;
    }
  };

  return (
    <Modal
      isOpen={openModal}
      onRequestClose={HandleCloseModal}
      style={AdjustPositionStyles}
      shouldCloseOnOverlayClick={false}
      contentLabel='NewLoan'
    >
      <ModalHeader>
        <h2>New Loan</h2>
        <button onClick={() => closeModal()}>
          <img src={CloseModal} alt='' />
        </button>
      </ModalHeader>
      <NewLoan
        collateralAmountForInput={collateralAmountForInput}
        handleSubmit={handleSubmit}
        calcMinCollateralAmount={calcMinCollateralAmount}
        calcMaxBorrowedAmount={calcMaxBorrowedAmount}
      />
    </Modal>
  );
};

LoanModal.propTypes = {
  ethereum: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  setBorrowedAskAmount: PropTypes.func.isRequired,
  setCollateralAmount: PropTypes.func.isRequired,
  ethereum: state.ethereum,
  form: state.form
});



export default connect(mapStateToProps, {
  setBorrowedAskAmount,
  setCollateralAmount,
  loansFetchData
})(LoanModal);
