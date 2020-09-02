import Onboard from 'bnc-onboard';
import Notify from 'bnc-notify';

let onboard = undefined;
let notify = undefined;
const networkId = 42;
const dappId = '12153f55-f29e-4f11-aa07-90f10da5d778';

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
          {
            walletName: 'walletConnect',
            infuraKey: 'b036e8717e624f5c826fdb9205e391d2',
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
      dappId,
      networkId
    });
  }
  return notify;
}
