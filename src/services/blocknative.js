import Onboard from 'bnc-onboard';
import Notify from 'bnc-notify';

let onboard = undefined;
let notify = undefined;

export function initOnboard(subscriptions) {
  if (!onboard) {
    onboard = Onboard({
      subscriptions,
      hideBranding: true,
      darkMode: true,
      networkId: parseInt(process.env.REACT_APP_networkId),
      walletSelect: {
        wallets: [
          { walletName: 'metamask', preferred: true },
          { walletName: 'coinbase', preferred: true },
          {
            walletName: 'walletConnect',
            infuraKey: process.env.REACT_APP_infuraKey,
            preferred: true
          }
        ]
      }
    });
  }
  return onboard;
}

export function initNotify() {
  if (!notify) {
    notify = Notify({
      dappId: process.env.REACT_APP_blocknativeKey,
      networkId: parseInt(process.env.REACT_APP_networkId)
    });
  }
  return notify;
}
