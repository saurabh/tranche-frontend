import Onboard from 'bnc-onboard';
import Notify from 'bnc-notify';
import store from 'redux/store';
import {
  networkId,
  alchemyHttpUrl as rpcUrl,
  infuraKey,
  blocknativeKey as dappId,
  networkParams
} from 'config';

let onboard = undefined;
let notify = undefined;

export function initOnboard(subscriptions) {
  if (!onboard) {
    const state = store.getState();
    const { theme } = state;
    onboard = Onboard({
      subscriptions,
      hideBranding: true,
      networkId,
      // networkName: 'Polygon',
      darkMode: theme === 'dark' ? true : theme === 'light' ? false : null,
      walletSelect: {
        wallets: [
          { walletName: 'metamask', preferred: true },
          { walletName: 'walletConnect', infuraKey, preferred: true },
          { walletName: 'coinbase', preferred: true },
          { walletName: 'status', preferred: true },
          { walletName: 'trust', rpcUrl, preferred: true },
          { walletName: 'torus', preferred: true }
        ]
      },
      walletCheck: [
        { checkName: 'derivationPath' },
        { checkName: 'connect' },
        { checkName: 'accounts' },
        { checkName: 'network' },
        { checkName: 'balance' }
      ]
    });
  }
  return onboard;
}

export function initNotify() {
  if (!notify) {
    notify = Notify({
      dappId,
      networkId,
      darkMode: true
    });
  }
  return notify;
}

export function switchNetwork(network) {
  const state = store.getState();
  const { wallet } = state.ethereum;

  wallet.provider
    .request({
      method: 'wallet_addEthereumChain',
      params: [networkParams[network]]
    })
    .catch((error) => {
      console.log(error);
    });
}
