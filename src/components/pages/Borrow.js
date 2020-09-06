import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initNotify } from 'utils/services';
import { Layout } from 'components/common';
import JLoansFactoryConstructor from 'utils/JLoansFactoryConstructor';

const Borrow = ({ ethereum: { address, network, balance, wallet, web3 } }) => {
  const JLoansFactory = JLoansFactoryConstructor(web3);
  const [notify, setNotify] = useState(null);

  useEffect(() => {
    setNotify(initNotify());
  }, [address, network, balance, wallet, web3]);

  const createNewLoan = async (
    name,
    borrowedCurrency,
    borrowedAmount,
    rpbRate,
    startPrice
  ) => {
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
  ethereum: state.ethereum
});

export default connect(mapStateToProps, {})(Borrow);
