import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
} from "redux/actions/ethereum";
import { initOnboard } from "services/blocknative";
import { readyToTransact } from 'utils/helperFunctions';
import { Layout } from "components/common";
import Loan from "components/common/Loan";
import SummaryCards from '../common/Summary/SummaryCards';
import { pageType } from 'config/constants';

import Table from '../common/Table/Table';
const Borrow = ({
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { address, network, balance, wallet, web3 },
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3,
  });

  useEffect(() => {
  }, [onboard, address, network, balance, wallet, web3]);

  const handleNewLoanClick = async () => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    setShowModal(true);
    setModalType("new");
  };

  // const handleAdjustLoanClick = () => {
  //   setShowModal(true)
  //   setModalType('adjust')
  //   const ready = await readyToTransact();
  //   if (!ready) return;
  // }

  return (
    <Layout>
      {/* <SummaryCards /> */}
      <Table HandleNewLoan={handleNewLoanClick} openModal={showModal} pageType={pageType.BORROW}/>
      <Loan
        openModal={showModal}
        type={modalType}
        closeModal={() => setShowModal(false)}
      />
    </Layout>
  );
};

Borrow.propTypes = {
  ethereum: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setWalletAndWeb3: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
})(Borrow);
