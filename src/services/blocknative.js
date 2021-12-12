import Onboard from 'bnc-onboard';
import Notify from 'bnc-notify';
import store from 'redux/store';
import { networkId, alchemyHttpUrl as rpcUrl, infuraKey, blocknativeKey as dappId, networkParams } from 'config';

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
  try
  {
    console.log(network);
    const state = store.getState();
    const { wallet } = state.ethereum;
    if (wallet) {
      if (network === 'kovan' || network === 'mainnet') {
        wallet.provider
          .request({
            id: network === 'mainnet' ? 1 : 42,
            jsonrpc: 2.0,
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: network === 'mainnet' ? '0x1' : '0x2a'
              }
            ]
          })
          .catch((error) => {
            console.log(error);
          });
        return;
      }
      wallet.provider
      .request({
        method: 'wallet_addEthereumChain',
        params: [networkParams[network]]
      })
      .catch((error) => {
        console.log(error);
      });
    }
    // wallet.provider
    //   .request({
    //     method: 'wallet_switchEthereumChain',
    //     params: [{[Object.keys(networkParams[network])[0]]: networkParams[network].chainId}]
    //   })
    //   .catch((error) => {
    //     if (error.code === 4902) {
    //       wallet.provider
    //       .request({
    //         method: 'wallet_addEthereumChain',
    //         params: [networkParams[network]]
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //     }
    //   });
  } catch (error) {
    console.log(error);
  }
}
