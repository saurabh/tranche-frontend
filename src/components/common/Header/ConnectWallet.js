import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
} from 'redux/actions/ethereum';
import { initOnboard } from 'services/blocknative';
import addrShortener from 'utils/addrShortener';
import { WalletBtn, WalletBtnIcon, WalletBtnText } from './HeaderComponents';

const ConnectWallet = ({
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { address, network, balance, wallet, web3 }
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
    )

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }, [onboard, address, network, balance, wallet, web3]);
  
  


  const handleConnect = async () => {
    await onboard.walletSelect()
    await onboard.walletCheck()
  };

  return (
    <>
      {balance < 0 ? (
        <WalletBtn onClick={handleConnect} onKeyUp={handleConnect}>
          <WalletBtnText icon={false}>
            <h2>Connect</h2>
          </WalletBtnText>
        </WalletBtn>
      ) : (
        <WalletBtn onClick={handleConnect} onKeyUp={handleConnect}>
          <WalletBtnIcon>
            <img src="" alt=""/>
          </WalletBtnIcon>
          <WalletBtnText>          
            <h2>
              {addrShortener(address)}
            </h2>
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
  ethereum: state.ethereum
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
})(ConnectWallet);
