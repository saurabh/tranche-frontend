import Web3 from 'web3';
import {
  SET_ADDRESS,
  SET_NETWORK,
  SET_BALANCE,
  SET_WALLET,
  SET_WEB3,
} from './constants';


export const setAddress = (address) => (dispatch) => {
  dispatch({
    type: SET_ADDRESS,
    payload: address
  });
};

export const setNetwork = (network) => (dispatch) => {
  dispatch({
    type: SET_NETWORK,
    payload: network
  });
};

export const setBalance = (balance) => (dispatch) => {
  dispatch({
    type: SET_BALANCE,
    payload: balance
  });
};

export const setWalletAndWeb3 = (wallet) => (dispatch) => {
  let web3 = new Web3(wallet.provider);
  dispatch({
    type: SET_WALLET,
    payload: wallet
  });
  dispatch({
    type: SET_WEB3,
    payload: web3
  });
  window.localStorage.setItem('selectedWallet', wallet.name)
};
