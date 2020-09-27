import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setBorrowedAskAmount, setCollateralAmount } from 'redux/actions/form';
import { Modal } from 'semantic-ui-react';
import { NewLoan } from 'components/common';
// import NewLoan from 'components/common/modals/BorrowForm';
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

  useEffect(() => {}, [address, network, balance, wallet, web3]);

  const calcMinCollateralAmount = async (pairId, askAmount) => {
    try {
      const result = await JFactory.methods
        .calcMinCollateralAmount(pairId, askAmount)
        .call();
      setCollateralAmount(web3.utils.fromWei(result, 'Ether'));
    } catch (error) {
      console.error(error);
    }
  };

  //  const calcMinBorrowedlAmount = async (pairId, askAmount) => {
  //   try {
  //     const result = await JFactory.methods
  //       .calcMinCollateralAmount(pairId, askAmount)
  //       .call();

  //     setCollateralAmount(result);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
                .createNewTokenLoan(
                  pairId,
                  borrowedAskAmount,
                  rpbRate,
                  lendToken
                )
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
      {/* <Button onClick={() => calcMinCollateralAmount()}></Button> */}
      <NewLoan
        handleSubmit={handleSubmit}
        calcMinCollateralAmount={calcMinCollateralAmount}
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
