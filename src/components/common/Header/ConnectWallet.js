import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
} from 'redux/actions/ethereum';
import getOnboard from 'utils/Onboarding';
import addrShortener from 'utils/addrShortener';

import { StyledButton } from './HeaderComponents';

const ConnectWallet = ({
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { address, network, balance, wallet, web3 }
}) => {
  useEffect(() => {}, [address, network, balance, wallet, web3]);

  const onboard = getOnboard({
    address: (address) => {
      setAddress(address);
    },
    network: (network) => {
      setNetwork(network);
    },
    balance: (balance) => {
      setBalance(balance);
    },
    wallet: (wallet) => {
      setWalletAndWeb3(wallet);
    }
  });

  const handleConnect = async () => {
    await onboard.walletSelect();
    await onboard.walletCheck();
  };

  return (
    <>
      {balance < 0 ? (
        <StyledButton onClick={handleConnect} onKeyUp={handleConnect}>
          Connect
        </StyledButton>
      ) : (
        <StyledButton onClick={handleConnect} onKeyUp={handleConnect}>
          {addrShortener(address)}
        </StyledButton>
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
