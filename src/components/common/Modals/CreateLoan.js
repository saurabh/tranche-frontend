import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { loansFetchData } from 'redux/actions/loans';
import NewLoan from 'components/common/Form/NewLoan';
import { JFactorySetup } from 'utils/contractConstructor';
import { isGreaterThan } from 'utils/helperFunctions';
import { submitValidations } from 'utils/validations';
import { JLoanTokenDeployerAddress } from 'config/constants';
import { pairData } from 'config/constants';
import { ModalHeader } from './ModalComponents';
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
  ethereum: { address, network, balance, wallet, web3, notify },
  form,
  loansFetchData,
  openModal,
  closeModal
}) => {
  const JFactory = JFactorySetup(web3);
  const toWei = web3.utils.toWei;

  function handleCloseModal() {
    closeModal();
  }

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
            limit: 100,
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
      const { collateralTokenSetup } = pairData[pairId];
      const collateralToken = collateralTokenSetup(web3);
      let userAllowance = await collateralToken.methods
        .allowance(address, JLoanTokenDeployerAddress)
        .call();
      if (isGreaterThan(collateralAmount, userAllowance)) {
        await collateralToken.methods
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
              limit: 100,
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
              limit: 100,
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

  const createNewLoan = async (e) => {
    try {
      e.preventDefault();
      let { pairId, borrowedAskAmount, collateralAmount, rpbRate } = form.newLoan.values;
      pairId = parseFloat(pairId);
      // submitValidations(form.newLoan.values).then(() => {
      // }).catch(error => console.error)
      borrowedAskAmount = toWei(borrowedAskAmount);
      collateralAmount = toWei(collateralAmount);
      if (pairId === pairData[0].value) {
        createNewEthLoan(pairId, borrowedAskAmount, rpbRate, collateralAmount);
      } else if (pairId === pairData[1].value) {
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
