import Web3 from 'web3';
import { web3 } from 'utils/getWeb3';
import { pairData } from 'config/constants'
import { DAISetup, JPTSetup, USDCSetup } from 'utils/contractConstructor'
import {
  SET_ADDRESS,
  SET_NETWORK,
  SET_BALANCE,
  SET_TOKEN_BALANCE,
  SET_TOKEN_BALANCES,
  SET_WALLET,
  SET_WEB3,
} from './constants';

const searchArr = (key) => pairData.find((i) => i.key === key);

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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
  await timeout(3000);
  const { lendTokenSetup } = searchArr(tokenName);
  const lendToken = lendTokenSetup(web3);
  const tokenBalance = await lendToken.methods.balanceOf(address).call();

  dispatch({
    type: SET_TOKEN_BALANCE,
    payload: { tokenName, tokenBalance }
  });
};

export const setTokenBalances = (address) => async (dispatch) => {
  const DAI = DAISetup(web3);
  const JPT = JPTSetup(web3);
  const USDC = USDCSetup(web3);
  const daiBalance = await DAI.methods.balanceOf(address).call();
  const jptBalance = await JPT.methods.balanceOf(address).call();
  const usdcBalance = await USDC.methods.balanceOf(address).call();

  const tokenBalances = { DAI: daiBalance, JPT: jptBalance, USDC: usdcBalance }
  dispatch({
    type: SET_TOKEN_BALANCES,
    payload: tokenBalances
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
