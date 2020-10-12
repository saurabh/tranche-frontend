import Onboard from 'bnc-onboard';
import Notify from 'bnc-notify';

let onboard = undefined;
let notify = undefined;

const networkId = parseInt(process.env.REACT_APP_networkId);
const rpcUrl = process.env.REACT_APP_infuraProviderUrl;
const infuraKey = process.env.REACT_APP_infuraKey;
const dappId = process.env.REACT_APP_blocknativeKey;

export function initOnboard(subscriptions) {
  if (!onboard) {
    onboard = Onboard({
      subscriptions,
      hideBranding: true,
      darkMode: true,
      networkId,
      walletSelect: {
        wallets: [
          { walletName: 'metamask', preferred: true },
          { walletName: 'coinbase', preferred: true },
          { walletName: 'coinbase', preferred: true },
          { walletName: 'status', preferred: true },
          { walletName: 'trust', rpcUrl, preferred: true },
          { walletName: 'ledger', rpcUrl, preferred: true },
          { walletName: 'torus', preferred: true },
          { walletName: 'authereum', preferred: true },
          { walletName: 'walletConnect', infuraKey, preferred: true }
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
      networkId
    });
  }
  return notify;
}
