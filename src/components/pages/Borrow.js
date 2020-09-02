import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initNotify } from 'utils/services';
import { Layout } from 'components/common';
import JLoansFactoryConstructor from 'utils/JLoansFactoryConstructor';

const Borrow = ({ ethereum: { address, network, balance, wallet, web3 } }) => {
  const [notify, setNotify] = useState(null);

  useEffect(() => {
    if (web3) {
      const JloansFactory = JLoansFactoryConstructor(web3);
      console.log(JloansFactory.methods);
    }

    setNotify(initNotify());
  }, [address, network, balance, wallet, web3]);

  // const createNewLoan = async () => {
  // };

  return (
    <Layout>
      <h1>Borrow</h1>;
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
