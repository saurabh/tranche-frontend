import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalances } from 'redux/actions/ethereum';
import { initOnboard } from 'services/blocknative';
import { readyToTransact } from 'utils';
import { Layout } from 'app/components/Stake/Layout';
import { PagesData, GoogleAnalyticsTrackingID, networkId } from 'config/constants';
import Table from '../components/Stake/Table/Table';

function Stake({ ethereum: { address, wallet }, setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalances }) {
  const [ModalIsOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  
  useEffect(() => {
    ReactGA.initialize(GoogleAnalyticsTrackingID, { gaOptions: { userId: address } });
  }, [address]);
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  });
  
  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  onboard.config({ networkId });
  
  const openModal = async (type = null) => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    address = !address ? onboard.getState().address : address;
    setTokenBalances(address);
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    // setModalType(true);
  };

  return (
    <Layout ModalIsOpen={ModalIsOpen} modalType={modalType} openModal={openModal} closeModal={closeModal}>
<Table pageType={PagesData.borrow.pageType} title='SLICE Staking Pools' />
      <Table pageType={PagesData.borrow.pageType} title='Liquidity Provider Pools' />
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  ethereum: state.ethereum
});

export default connect(mapStateToProps, {setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalances})(withRouter(Stake));
