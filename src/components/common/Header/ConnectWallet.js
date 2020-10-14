import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
} from 'redux/actions/ethereum';
import { initOnboard } from 'services/blocknative';
import { changePath } from 'redux/actions/TogglePath';
import { addrShortener } from 'utils/helperFunctions';
import { WalletBtn, WalletBtnIcon, WalletBtnText } from './HeaderComponents';
import { PagesData } from 'config/constants';

const ConnectWallet = ({
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { address, network, balance, wallet, web3 },
  pathChanged
}) => {
  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });
  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem(
      'selectedWallet'
    );

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet);
    }
  }, [onboard, address, network, balance, wallet, web3]);
  
  const { pathname } = useLocation();
  const [path, setPath] = useState(pathname.split('/')[1] || "borrow");
  useEffect(() => {
    const parsePath = () => {
      setPath(pathname.split('/')[1]);
    };

    parsePath();
  }, [pathname]);

  const handleConnect = async () => {
    await onboard.walletSelect();
    await onboard.walletCheck();
  };

  return (
    <>
      {balance < 0 ? (
        <WalletBtn background={PagesData[path].secondaryColor} onClick={handleConnect} onKeyUp={handleConnect}>
          <WalletBtnText icon={false} color={PagesData[path].color}>
            <h2>Connect</h2>
          </WalletBtnText>
        </WalletBtn>
      ) : (
        <WalletBtn background={PagesData[path].secondaryColor} onClick={handleConnect} onKeyUp={handleConnect}>
          <WalletBtnIcon>
            <img src='' alt='' />
          </WalletBtnIcon>
          <WalletBtnText color={PagesData[path].color}>
            <h2>{addrShortener(address)}</h2>
          </WalletBtnText>
        </WalletBtn>
      )}
    </>
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
  ethereum: state.ethereum,
  pathChanged: state.changePath
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
})(ConnectWallet);
