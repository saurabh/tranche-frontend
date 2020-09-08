import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
} from 'redux/actions/ethereum';
import { initOnboard, initNotify } from 'utils/services';
import { Layout } from 'components/common';
import LoanModal from 'components/common/modals/LoanModal'
import JLoansFactoryConstructor from 'utils/JLoansFactoryConstructor';

const Borrow = ({
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { address, network, balance, wallet, web3 }
}) => {
  const JLoansFactory = JLoansFactoryConstructor(web3);
  const [notify, setNotify] = useState(null);
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  useEffect(() => {
    setNotify(initNotify());
  }, [onboard, address, network, balance, wallet, web3]);

  const readyToTransact = async () => {
    if (!wallet) {
      const walletSelected = await onboard.walletSelect();
      if (!walletSelected) return false;
    }

    const ready = await onboard.walletCheck();
    return ready;
  };

  const createNewLoan = async (
    name,
    borrowedCurrency,
    borrowedAmount,
    rpbRate,
    startPrice
  ) => {
    const ready = await readyToTransact();
    if (!ready) return;
    const walletState = await onboard.getState();
    
    await JLoansFactory.methods
      .deployNewEthLoanContract('eth', 'dai', 10, 5, 10)
      .send({ from: walletState.address })
      .on('transactionHash', (hash) => {
        notify(hash);
      });
  };

  const handleNewLoanClick = async () => {
    const ready = await readyToTransact();
    if (!ready) return;
    setShowModal(true)
    setModalType('new')
  }

  // const handleAdjustLoanClick = () => {
  //   setShowModal(true)
  //   setModalType('adjust')
  //   const ready = await readyToTransact();
  //   if (!ready) return;
  // }
  

  return (
    <Layout>
      <h1>Borrow</h1>
      <button onClick={handleNewLoanClick}>New Loan</button>
      <LoanModal open={showModal} type={modalType} closeModal={() => setShowModal(false)} />
    </Layout>
  );
};

Borrow.propTypes = {
  ethereum: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  setAddress: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setWalletAndWeb3: PropTypes.func.isRequired,
  ethereum: state.ethereum
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
})(Borrow);
