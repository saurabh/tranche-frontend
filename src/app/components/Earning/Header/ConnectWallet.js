import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { setAddress, setNetwork, setBalance, setWalletAndWeb3 } from 'redux/actions/ethereum';
import { initOnboard } from 'services/blocknative';
import { addrShortener } from 'utils/helperFunctions';
import { WalletBtn, WalletBtnIcon, WalletBtnText, NavBarRightWrapper } from './styles/HeaderComponents';
import { PagesData } from 'config/constants';
import Wallet from "assets/images/svg/wallet.svg";
import i18n from '../../locale/i18n';

const ConnectWallet = ({
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { address, balance }
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

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem('selectedWallet');

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet);
    }
  }, [onboard]);

  const parsePath = useCallback(() =>{
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
      {balance < 0 ? (
        <WalletBtn
          background="#4441CF"
          onClick={handleConnect}
          onKeyUp={handleConnect}
        >
           <WalletBtnIcon>
            <img src={Wallet} alt='wallet' />
          </WalletBtnIcon>
          <WalletBtnText icon={false} color={PagesData[path].color}>
            <h2>{i18n.t('connect')}</h2>
          </WalletBtnText>
        </WalletBtn>
      ) : (
        <WalletBtn
          background="#4441CF"
          onClick={handleConnect}
          onKeyUp={handleConnect}
        >
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
  ethereum: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
})(ConnectWallet);
