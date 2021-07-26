import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { setTxModalOpen, setTxModalType } from 'redux/actions/tableData';
import { setAddress, setNetwork, setBalance, setWalletAndWeb3 } from 'redux/actions/ethereum';
import { initOnboard } from 'services/blocknative';
import { addrShortener } from 'utils/helperFunctions';
import { WalletBtn, WalletBtnIcon, WalletBtnText, NavBarRightWrapper } from './styles/HeaderComponents';
import { ModeThemes, PagesData } from 'config/constants';
import Wallet from 'assets/images/svg/wallet.svg';
import i18n from '../../locale/i18n';
import { TrancheStake } from 'assets';
import TrancheModal from 'app/components/Modals/TrancheModal';

const ConnectWallet = ({
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  theme,
  ethereum: { address, balance },
  setTxModalOpen,
  setTxModalType
}) => {
  const { pathname } = useLocation();
  let parsedPath = pathname.split('/');
  const [path, setPath] = useState(parsedPath[parsedPath.length - 1] || 'borrow');

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  const openModal = () => {
    setTxModalOpen(true);
    setTxModalType('trancheRewards');
  };
  const closeModal = () => {
    setTxModalOpen(false);
  };

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem('selectedWallet');

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet);
    }
  }, [onboard]);

  const parsePath = useCallback(() => {
    setPath(parsedPath[parsedPath.length - 1]);
  }, [parsedPath]);
  useEffect(() => {
    parsePath();
  }, [pathname, parsePath]);

  const handleConnect = async () => {
    await onboard.walletSelect();
    await onboard.walletCheck();
  };

  return (
    <NavBarRightWrapper>
      <WalletBtn
        background={ModeThemes[theme].ModalTrancheNavbarBtn}
        shadow={ModeThemes[theme].ModalTrancheNavbarBtnShadow}
        border={ModeThemes[theme].ModalTrancheNavbarBtnBorder}
        tranche
        onClick={() => openModal()}
      >
        <WalletBtnIcon tranche>
          <img src={TrancheStake} alt='tranche' />
        </WalletBtnIcon>
        <WalletBtnText tranche icon={false} color={ModeThemes[theme].ModalTrancheNavbarBtnText}>
          <h2>1005.125</h2>
        </WalletBtnText>
      </WalletBtn>

      <TrancheModal closeModal={() => closeModal()} />
      {balance < 0 ? (
        <WalletBtn background='#4441CF' onClick={handleConnect} onKeyUp={handleConnect}>
          <WalletBtnIcon>
            <img src={Wallet} alt='wallet' />
          </WalletBtnIcon>
          <WalletBtnText icon={false} color={PagesData[path].color}>
            <h2>{i18n.t('connect')}</h2>
          </WalletBtnText>
        </WalletBtn>
      ) : (
        <WalletBtn background='#4441CF' onClick={handleConnect} onKeyUp={handleConnect}>
          <WalletBtnIcon>
            <img src={Wallet} alt='' />
          </WalletBtnIcon>
          <WalletBtnText color={PagesData[path].color}>
            <h2>{addrShortener(address)}</h2>
          </WalletBtnText>
        </WalletBtn>
      )}
    </NavBarRightWrapper>
  );
};

ConnectWallet.propTypes = {
  setAddress: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setWalletAndWeb3: PropTypes.func.isRequired,
  setTxModalOpen: PropTypes.func.isRequired,
  setTxModalType: PropTypes.func.isRequired,
  ethereum: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  theme: state.theme
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTxModalOpen,
  setTxModalType
})(ConnectWallet);
