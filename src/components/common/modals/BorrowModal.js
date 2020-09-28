import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setBorrowedAskAmount, setCollateralAmount } from 'redux/actions/form';
import { Modal } from 'semantic-ui-react';
import { NewLoan } from 'components/common';
import JFactoryConstructor from 'utils/JFactoryConstructor';

const LoanModal = ({
  open,
  type,
  closeModal,
  ethereum: { address, network, balance, wallet, web3, notify },
  form,
  setBorrowedAskAmount,
  setCollateralAmount
}) => {
  const JFactory = JFactoryConstructor(web3);
  const toBN = web3.utils.toBN;
  const toWei = web3.utils.toWei;
  const fromWei = web3.utils.fromWei;

  useEffect(() => {}, [address, network, balance, wallet, web3]);

  const calcMinCollateralAmount = async (pairId, askAmount) => {
    const amount = toBN(askAmount);
    const finalamount = toWei(amount, 'Ether');
    try {
      const result = await JFactory.methods
        .calcMinCollateralAmount(pairId, finalamount)
        .call();
      setCollateralAmount(fromWei(result, 'Ether'));
    } catch (error) {
      console.error(error);
    }
  };

  const calcMaxBorrowedAmount = async (pairId, collAmount) => {
    const amount = toBN(collAmount);
    const finalamount = toWei(amount, 'Ether');
    try {
      const result = await JFactory.methods
        .calcMaxStableCoinAmount(pairId, finalamount)
        .call();
      setBorrowedAskAmount(web3.utils.fromWei(result, 'Ether'));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    switch (type) {
      case 'new':
        async function createNewLoan() {
          const tempRpbRate = 1000;
          const {
            pairId,
            borrowedAskAmount,
            collateralAmount,
            rpbRate
          } = form.newLoan.values;

          console.log(+pairId, +borrowedAskAmount, +collateralAmount, +rpbRate);
          // pairId = 0
          //   ? await JFactory.methods
          //       .createNewEthLoan(pairId, borrowedAskAmount, tempRpbRate)
          //       .send({ value: collateralAmount, from: address })
          //       .on('transactionHash', (hash) => {
          //         notify.hash(hash);
          //       })
          //   : await JFactory.methods
          //       .createNewTokenLoan(
          //         pairId,
          //         borrowedAskAmount,
          //         rpbRate
          //       )
          //       .send({ from: address })
          //       .on('transactionHash', (hash) => {
          //         notify.hash(hash);
          //       });
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
      <NewLoan
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
  setCollateralAmount
})(LoanModal);
