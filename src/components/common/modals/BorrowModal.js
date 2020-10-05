import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setBorrowedAskAmount, setCollateralAmount } from 'redux/actions/form';
import { loansFetchData } from 'redux/actions/loans';
import { Modal } from 'semantic-ui-react';
import { NewLoan } from 'components/common';
import { JFactorySetup, JPTSetup } from 'utils/contractConstructor';
import { isGreaterThan } from 'utils/helperFunctions';
import { JLoanTokenDeployerAddress } from 'config/ethereum';

const LoanModal = ({
  open,
  type,
  closeModal,
  ethereum: { address, network, balance, wallet, web3, notify },
  form,
  setBorrowedAskAmount,
  setCollateralAmount,
  loansFetchData
}) => {
  const JFactory = JFactorySetup(web3);
  const JPT = JPTSetup(web3);
  const toWei = web3.utils.toWei;
  const fromWei = web3.utils.fromWei;

  useEffect(() => {}, [address, network, balance, wallet, web3]);

  const calcMinCollateralAmount = async (pairId, askAmount) => {
    try {
      const finalamount = toWei(askAmount);
      const result = await JFactory.methods
        .calcMinCollateralWithFeesAmount(pairId, finalamount)
        .call();
      setCollateralAmount(fromWei(result));
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
      setBorrowedAskAmount(web3.utils.fromWei(result));
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
  setCollateralAmount,
  loansFetchData
})(LoanModal);
