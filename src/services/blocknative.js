import Onboard from 'bnc-onboard';
import Notify from 'bnc-notify';
import { blocknativeKey, infuraKey, networkId } from 'config'

let onboard = undefined;
let notify = undefined;

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
            infuraKey,
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
      dappId: blocknativeKey,
      networkId
    });
  }
  return notify;
}
