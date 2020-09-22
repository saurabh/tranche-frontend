import Onboard from 'bnc-onboard';
import Notify from 'bnc-notify';

let onboard = undefined;
let notify = undefined;
const networkId = 42;
const dappId = '71c3eafc-6ae2-4fe9-863c-6c87ec604798';

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
