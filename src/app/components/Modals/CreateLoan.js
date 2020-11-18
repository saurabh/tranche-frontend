import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { loansFetchData } from 'redux/actions/loans';
import NewLoan from 'app/components/Form/NewLoan';
import { JLoanSetup } from 'utils/contractConstructor';
import { isGreaterThan } from 'utils/helperFunctions';
import { pairData, txMessage } from 'config';
import { ModalHeader } from './styles/ModalsComponents';
import { CloseModal } from 'assets';

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

const CreateLoan = ({
  ethereum: { address, web3, notify },
  form,
  loansFetchData,
  openModal,
  closeModal
}) => {
  const toWei = web3.utils.toWei;
  const fromWei = web3.utils.fromWei;

  function handleCloseModal() {
    closeModal();
  }

  const calculateFees = async (pairId, borrowedAskAmount, rpbRate, collateralAmount) => {
    try {
      const { loanContractAddress } = pairData[pairId];
      const JLoan = JLoanSetup(web3, loanContractAddress);
      let gasLimit;
      if (pairId === pairData[0].value) {
        gasLimit = await JLoan.methods
          .openNewLoan(borrowedAskAmount, rpbRate)
          .estimateGas({ value: collateralAmount, from: address });
      } else {
        gasLimit = await JLoan.methods
          .openNewLoan(borrowedAskAmount, rpbRate)
          .estimateGas({ from: address });
      }
      console.log(gasLimit);
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
      const { loanContractAddress } = pairData[pairId];
      const JLoan = JLoanSetup(web3, loanContractAddress);
      await JLoan.methods
        .openNewLoan(borrowedAskAmount, rpbRate)
        .send({ value: collateralAmount, from: address })
        .on('transactionHash', (hash) => {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
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
      const { collateralTokenSetup, loanContractAddress } = pairData[pairId];
      const collateralToken = collateralTokenSetup(web3);
      const JLoan = JLoanSetup(web3, loanContractAddress);
      let userAllowance = await collateralToken.methods
        .allowance(address, loanContractAddress)
        .call();
      if (isGreaterThan(collateralAmount, userAllowance)) {
        await collateralToken.methods
          .approve(loanContractAddress, collateralAmount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          });
        await JLoan.methods
          .openNewLoan(borrowedAskAmount, rpbRate)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          });
      } else {
        await JLoan.methods
          .openNewLoan(borrowedAskAmount, rpbRate)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNewLoan = async (e) => {
    try {
      e.preventDefault();
      let { pairId, borrowedAskAmount, collateralAmount, rpbRate } = form.newLoan.values;
      pairId = parseFloat(pairId);
      borrowedAskAmount = toWei(borrowedAskAmount);
      collateralAmount = toWei(collateralAmount);
      calculateFees(pairId, borrowedAskAmount, rpbRate, collateralAmount);
      if (pairId === pairData[0].value) {
        createNewEthLoan(pairId, borrowedAskAmount, rpbRate, collateralAmount);
      } else {
        createNewTokenLoan(pairId, borrowedAskAmount, rpbRate, collateralAmount);
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={openModal}
      onRequestClose={handleCloseModal}
      style={AdjustPositionStyles}
      shouldCloseOnOverlayClick={false}
      contentLabel='NewLoan'
    >
      <ModalHeader>
        <h2>New Loan Request</h2>
        <button onClick={() => closeModal()}>
          <img src={CloseModal} alt='' />
        </button>
      </ModalHeader>
      <NewLoan createNewLoan={createNewLoan} />
    </Modal>
  );
};

CreateLoan.propTypes = {
  ethereum: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  form: state.form
});

export default connect(mapStateToProps, {
  loansFetchData
})(CreateLoan);
