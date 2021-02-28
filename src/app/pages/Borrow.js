import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances
} from 'redux/actions/ethereum';
import { initOnboard } from 'services/blocknative';
import { readyToTransact } from 'utils/helperFunctions';
import { Layout } from 'app/components';
import CreateLoan from 'app/components/Modals/CreateLoan';
import { PagesData } from 'config/constants';
import Table from '../components/Table/Table';
import SummaryCards from 'app/components/Summary/SummaryCards';

const Borrow = ({
  setAddress,
  setNetwork,
  setBalance,
  path,
  setWalletAndWeb3,
  ethereum: { address, wallet, web3 }
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
    if (!address) {
      const { address } = onboard.getState();
      setTokenBalances(address);
    } else setTokenBalances(address);
  };

  return (
    <Layout>
      <SummaryCards />
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
  ethereum: state.ethereum,
  path: state.path
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
})(Borrow);
