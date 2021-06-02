import Onboard from 'bnc-onboard';
import Notify from 'bnc-notify';
import store from 'redux/store';
import { setTxLoading } from 'redux/actions/ethereum';
import { networkId, alchemyHttpUrl as rpcUrl, infuraKey, blocknativeKey as dappId, txMessage } from 'config';

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
      networkName: 'Polygon',
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

export function notifyEmitter(hash) {
  try {
    const state = store.getState();
    const { notify, network } = state.ethereum;
    if (network === networkId) {
      console.log('network check');
      const { emitter } = notify.hash(hash);
      emitter.on('txRequest', console.log);
      emitter.on('txRepeat', console.log);
      emitter.on('txAwaitingApproval', console.log);
      emitter.on('txConfirmReminder', console.log);
      emitter.on('txSendFail', console.log);
      emitter.on('txError', console.log);
      emitter.on('txUnderPriced', console.log);
      emitter.on('txSent', console.log);
      emitter.on('txPool', console.log);
      emitter.on('txSpeedUp', console.log);
      emitter.on('txConfirmed', () => store.dispatch(setTxLoading(false)));
      emitter.on('txFailed', () => store.dispatch(setTxLoading(false)));
      emitter.on('txCancel', () => store.dispatch(setTxLoading(false)));
      emitter.on('txPool', (transaction) => {
        return {
          message: txMessage(transaction.hash)
        };
      });
      // emitter.on('txRequest', store.dispatch(setTxLoading(true)))
    }
  } catch (error) {
    console.error(error);
  }
}
