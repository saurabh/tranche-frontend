import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from 'app/components/Stake/Layout';
import { PagesData, GoogleAnalyticsTrackingID } from 'config/constants';
import Table from '../components/Stake/Table/Table';

function Stake({ ethereum: { address } }) {
  const [ModalIsOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    ReactGA.initialize(GoogleAnalyticsTrackingID, { gaOptions: { userId: address } });
  }, [address]);
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  });

  const openModal = async (type = null) => {
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

export default connect(mapStateToProps, null)(withRouter(Stake));
