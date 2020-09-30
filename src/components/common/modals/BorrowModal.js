import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setBorrowedAskAmount, setCollateralAmount } from 'redux/actions/form';
import { Modal } from 'semantic-ui-react';
import { NewLoan } from 'components/common';
import { JFactorySetup, DaiSetup } from 'utils';
import { JFactoryAddress, assets } from 'config';

const LoanModal = ({
  open,
  type,
  closeModal,
  ethereum: { address, network, balance, wallet, web3, notify },
  form,
  setBorrowedAskAmount,
  setCollateralAmount
}) => {
  const JFactory = JFactorySetup(web3);
  const DAI = DaiSetup(web3);
  const BN = web3.utils.BN;
  const toBN = web3.utils.toBN;
  const toWei = web3.utils.toWei;
  const fromWei = web3.utils.fromWei;

  useEffect(() => {}, [address, network, balance, wallet, web3]);

  const calcMinCollateralAmount = async (pairId, askAmount) => {
    const finalamount = toWei(askAmount);
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
    const finalamount = toWei(collAmount);
    try {
      const result = await JFactory.methods
        .calcMaxStableCoinAmount(pairId, finalamount)
        .call();
      setBorrowedAskAmount(web3.utils.fromWei(result, 'Ether'));
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
      let userallowance = await DAI.methods
        .allowance(address, JFactoryAddress)
        .call({ from: address });
      userallowance = toWei(userallowance, 'ether');
      if (collateralAmount > userallowance) {
        await DAI.methods
          .approve(JFactoryAddress, collateralAmount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          });
        await JFactory.methods
          .createNewTokenLoan(pairId, borrowedAskAmount, rpbRate)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          });
      } else {
        await JFactory.methods
          .createNewTokenLoan(pairId, borrowedAskAmount, rpbRate)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
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
