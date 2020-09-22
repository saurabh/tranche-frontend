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

  const handleActionClick = (e) => {
    e.preventDefault();

    switch (type) {
      case 'new':
        async function createNewEthLoan(
          name,
          borrowedCurrency,
          borrowedAmount,
          rpbRate,
          startPrice
        ) {
          console.log('createNewLoanPending')
          /
        }
        createNewEthLoan();
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
      <NewLoan handleSubmit={handleActionClick}/>
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
