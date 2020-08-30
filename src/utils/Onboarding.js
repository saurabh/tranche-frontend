import Onboard from 'bnc-onboard';
let onboard = undefined;

const getOnboard = function (subscriptions) {
  if (!onboard) {
    onboard = Onboard({
      subscriptions,
      hideBranding: true,
      darkMode: true,
      networkId: 4,
      walletSelect: {
        wallets: [
          { walletName: 'metamask', preferred: true },
          { walletName: 'coinbase', preferred: true },
          // {
          //   walletName: 'walletConnect',
          //   infuraKey: process.env.REACT_APP_INFURA_KEY
          // }
        ]
      }
    });
  }
  
  return onboard;
};

export default getOnboard;
