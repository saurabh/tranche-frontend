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

    await JLoansFactory.methods
      .deployNewEthLoanContract('eth', 'dai', 10, 5, 10)
      .send({ from: address })
      .on('transactionHash', (hash) => {
        notify(hash);
      });
  };

  return (
    <Layout>
      <h1>Borrow</h1>
      <button onClick={createNewLoan}>new loan</button>
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
