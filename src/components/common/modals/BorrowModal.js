import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import { NewLoan } from 'components/common';
import JFactoryConstructor from 'utils/JFactoryConstructor';

const LoanModal = ({
  open,
  type,
  closeModal,
  ethereum: { address, network, balance, wallet, web3, notify }
}) => {
  const JFactory = JFactoryConstructor(web3);

  useEffect(() => {}, [address, network, balance, wallet, web3]);

  const calcMinCollateralAmount = async (pairId, askAmount) => {
    try {
      await JFactory.methods.calcMinCollateralAmount(pairId, askAmount).call();      
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    switch (type) {
      case 'new':
        async function createNewLoan(
          pairId,
          borrowedAskAmount,
          rpbRate,
          lendToken
        ) {
          pairId = 0
            ? await JFactory.methods
                .createNewEthLoan(pairId, borrowedAskAmount, rpbRate, lendToken)
                .send({ from: address })
                .on('transactionHash', (hash) => {
                  notify.hash(hash);
                })
            : await JFactory.methods
                .createNewTokenLoan(pairId, borrowedAskAmount, rpbRate, lendToken)
                .send({ from: address })
                .on('transactionHash', (hash) => {
                  notify.hash(hash);
                });
        }
        createNewLoan();
        closeModal();
        break;
      case 'adjust':
        break;
      default:
        break;
    }
  };

  return (
    <Modal open={open} onClose={() => closeModal()} size='mini'>
      <Modal.Header>
        {type === 'new' ? 'Create New' : 'Adjust'} Loan
      </Modal.Header>
      <NewLoan handleSubmit={handleSubmit} calcMinCollateralAmount={calcMinCollateralAmount}  />
    </Modal>
  );
};

LoanModal.propTypes = {
  ethereum: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum
});

export default connect(mapStateToProps, {})(LoanModal);
