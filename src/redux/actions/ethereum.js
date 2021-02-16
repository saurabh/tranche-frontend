import Web3 from 'web3';
import store from '../store';
import { pairData } from 'config/constants';
import {
  DAISetup,
  // SLICESetup,
  // USDCSetup,
  // JProtocolSetup,
  ERC20Setup
} from 'utils/contractConstructor';
import {
  SET_ADDRESS,
  SET_NETWORK,
  SET_BALANCE,
  SET_TOKEN_BALANCE,
  SET_TOKEN_BALANCES,
  SET_TRANCHE_TOKEN_BALANCES,
  SET_WALLET,
  SET_WEB3,
  SET_CURRENT_BLOCK
} from './constants';

const searchArr = (key) => pairData.find((i) => i.key === key);

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

export const setTokenBalance = (tokenName, address) => async (dispatch) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const { lendTokenSetup } = searchArr(tokenName);
    const lendToken = lendTokenSetup(web3);
    const tokenBalance = await lendToken.methods.balanceOf(address).call();

    dispatch({
      type: SET_TOKEN_BALANCE,
      payload: { tokenName, tokenBalance }
    });
  } catch (error) {
    console.error(error);
  }
};

export const setTokenBalances = (address) => async (dispatch) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const DAI = DAISetup(web3);
    // const SLICE = SLICESetup(web3);
    // const USDC = USDCSetup(web3);
    const daiBalance = await DAI.methods.balanceOf(address).call();
    // const sliceBalance = await SLICE.methods.balanceOf(address).call();
    // const usdcBalance = await USDC.methods.balanceOf(address).call();

    const tokenBalances = { DAI: daiBalance };
    // const tokenBalances = { DAI: daiBalance, SLICE: sliceBalance, USDC: usdcBalance };
    dispatch({
      type: SET_TOKEN_BALANCES,
      payload: tokenBalances
    });
  } catch (error) {
    console.error(error);
  }
};

export const setTrancheTokenBalances = (trancheName, tokenAddress, address) => async (dispatch) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const Tranche = ERC20Setup(web3, tokenAddress);
    const trancheTokenBalance = await Tranche.methods.balanceOf(address).call();
    dispatch({
      type: SET_TRANCHE_TOKEN_BALANCES,
      payload: { trancheName, trancheTokenBalance }
    });
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
