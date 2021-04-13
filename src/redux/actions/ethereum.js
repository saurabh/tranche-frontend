import Web3 from 'web3';
import store from '../store';
import { ERC20Setup } from 'utils/contractConstructor';
import { ERC20Tokens } from 'config/constants';
import {
  SET_ADDRESS,
  SET_NETWORK,
  SET_BALANCE,
  SET_TOKEN_BALANCE,
  SET_WALLET,
  SET_WEB3,
  SET_CURRENT_BLOCK,
  SET_TRANSACTION_LOADING
} from './constants';

export const setAddress = (address) => (dispatch) => {
  if (address) {
    dispatch({
      type: SET_ADDRESS,
      payload: address.toLowerCase()
    });
    window.localStorage.setItem('address', address.toLowerCase());
  }
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

export const setTokenBalance = (tokenAddress, address) => async (dispatch) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const token = ERC20Setup(web3, tokenAddress);
    const tokenBalance = await token.methods.balanceOf(address).call();

    dispatch({
      type: SET_TOKEN_BALANCE,
      payload: { tokenAddress, tokenBalance }
    });
  } catch (error) {
    console.error(error);
  }
};

export const setTokenBalances = (address) => async (dispatch) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const batch = new web3.BatchRequest();
    ERC20Tokens.map((tokenAddress) => {
      let token = ERC20Setup(web3, tokenAddress);
      batch.add(token.methods.balanceOf(address).call.request({ from: address }, (err, res) => {
        if (err) {
          console.error(err);
        } else {
          dispatch({
            type: SET_TOKEN_BALANCE,
            payload: { tokenAddress: tokenAddress.toLowerCase(), tokenBalance: res }
          });
        }
      }))
      return batch;
    })
    batch.execute();
  } catch (error) {
    console.error(error);
  }
};

export const setWalletAndWeb3 = (wallet) => async (dispatch) => {
  let web3 = new Web3(wallet.provider);
  dispatch({
    type: SET_WALLET,
    payload: wallet
  });
  dispatch({
    type: SET_WEB3,
    payload: web3
  });
  window.localStorage.setItem('selectedWallet', wallet.name);
};

export const setCurrentBlock = (blockNumber) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_BLOCK,
    payload: blockNumber
  });
};

export const setTxLoading = (bool) => (dispatch) => {
  dispatch({
    type: SET_TRANSACTION_LOADING,
    payload: bool
  });
};
