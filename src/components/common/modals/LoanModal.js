import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initNotify } from 'utils/services';
import { Modal, Button } from 'semantic-ui-react';
import JLoansFactoryConstructor from 'utils/JLoansFactoryConstructor';

const LoanModal = ({
  open,
  type,
  closeModal,
  ethereum: { address, network, balance, wallet, web3 }
}) => {
  const JLoansFactory = JLoansFactoryConstructor(web3);
  const [notify, setNotify] = useState(null);

  useEffect(() => {
    setNotify(initNotify());
  }, [address, network, balance, wallet, web3]);

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
          await JLoansFactory.methods
            .deployNewEthLoanContract('test', 'test', 33111, 21111111, 22222222)
            .send({ from: address })
            .on('transactionHash', (hash) => {
              notify.hash(hash);
            });
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
    <Modal open={open} onClose={() => closeModal()} size='mini' dimmer='false'>
      <Modal.Header>Create New Loan</Modal.Header>
      <Modal.Actions>
        <Button onClick={handleActionClick}>Create</Button>
      </Modal.Actions>
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
