import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import NewLoan from 'app/components/Form/NewLoan';
import { JLoanSetup } from 'utils/contractConstructor';
import { isEqualTo, isGreaterThan } from 'utils/helperFunctions';
import { pairData, LoanContractAddress, txMessage } from 'config';
import { ModalHeader } from './styles/ModalsComponents';
import { CloseModal } from 'assets';
import { toWei } from 'services/contractMethods';

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
    minHeight: '554px',
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

const CreateLoan = ({ ethereum: { address, web3, notify }, form, openModal, closeModal }) => {
  const JLoan = JLoanSetup(web3);
  const [hasAllowance, setHasAllowance] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleCloseModal() {
    closeModal();
  }

  const allowanceCheck = async (pairId, collateralAmount) => {
    try {
      if (pairId === 1) {
        collateralAmount = toWei(collateralAmount);
        const { collateralTokenSetup } = pairData[pairId];
        const collateralToken = collateralTokenSetup(web3);

        let userAllowance = await collateralToken.methods
          .allowance(address, LoanContractAddress)
          .call();
        if (
          isGreaterThan(userAllowance, collateralAmount) ||
          isEqualTo(userAllowance, collateralAmount)
        ) {
          setHasAllowance(true);
        } else {
          setHasAllowance(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const approveContract = async (pairId, collateralAmount) => {
    try {
      const { collateralTokenSetup } = pairData[pairId];
      const collateralToken = collateralTokenSetup(web3);
      setLoading(true);
      await collateralToken.methods
        .approve(LoanContractAddress, toWei(collateralAmount))
        .send({ from: address })
        .on('transactionHash', (hash) => {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
        })
        .on('confirmation', () => {
          setHasAllowance(true);
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const createNewEthLoan = async (pairId, borrowedAskAmount, rpbRate, collateralAmount) => {
    try {
      await JLoan.methods
        .openNewLoan(pairId, borrowedAskAmount, rpbRate)
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

  const createNewTokenLoan = async (pairId, borrowedAskAmount, rpbRate, collateralAmount) => {
    try {
      const { collateralTokenSetup } = pairData[pairId];
      const collateralToken = collateralTokenSetup(web3);

      let userAllowance = await collateralToken.methods
        .allowance(address, LoanContractAddress)
        .call();
      if (isGreaterThan(collateralAmount, userAllowance)) {
        await collateralToken.methods
          .approve(LoanContractAddress, collateralAmount)
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
          .openNewLoan(pairId, borrowedAskAmount, rpbRate)
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
          .openNewLoan(pairId, borrowedAskAmount, rpbRate)
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
      <NewLoan
        hasAllowance={hasAllowance}
        loading={loading}
        setHasAllowance={setHasAllowance}
        allowanceCheck={allowanceCheck}
        approveContract={approveContract}
        createNewLoan={createNewLoan}
      />
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

export default connect(mapStateToProps, {})(CreateLoan);
