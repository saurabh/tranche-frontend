import store from 'redux/store';
const state = store.getState();
const { blockExplorerUrl } = state.ethereum;

export const txMessage = (hash) =>
  `Your transaction is pending, click <a href="${blockExplorerUrl}/tx/${hash}" rel="noopener noreferrer" target="_blank">here</a> for more info.`;

export const serverDown = 'Our server is down. We will be back soon!';
