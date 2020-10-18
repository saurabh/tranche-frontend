import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
} from 'redux/actions/ethereum';
import { initOnboard } from 'services/blocknative';
import { readyToTransact } from 'utils/helperFunctions';
import { Layout } from 'components/common';
import CreateLoan from 'components/common/Modals/CreateLoan';
import { PagesData } from 'config/constants';
import Table from '../common/Table/Table';
const Borrow = ({
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { address, network, balance, wallet, web3 }
}) => {
  const [showModal, setShowModal] = useState(false);

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  const handleNewLoanClick = async () => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    setShowModal(true);
  };

  return (
    <Layout>
      <Table
        HandleNewLoan={handleNewLoanClick}
        openModal={showModal}
        pageType={PagesData.borrow.pageType}
      />
      <CreateLoan openModal={showModal} closeModal={() => setShowModal(false)} />
    </Layout>
  );
};

Borrow.propTypes = {
  ethereum: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setWalletAndWeb3: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
})(Borrow);
