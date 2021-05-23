import Web3 from 'web3';
import axios from 'axios';
import store from '../store';
import { ERC20Setup, isEqualTo, isGreaterThan } from 'utils';
import {
  networkId,
  maticNetworkId,
  serverUrl,
  apiUri,
  ERC20Tokens,
  JCompoundAddress,
  CompTrancheTokens,
  TrancheBuyerCoinAddresses,
  JAaveAddress,
  AaveTrancheTokens,
  PolygonBuyerCoinAddresses,
} from 'config/constants';
import {
  SET_ADDRESS,
  SET_NETWORK,
  SET_BALANCE,
  SET_TOKEN_BALANCE,
  // SET_TOKEN_BALANCES,
  SET_WALLET,
  SET_WEB3,
  SET_CURRENT_BLOCK,
  SET_TRANSACTION_LOADING,
  SET_TRANCHE_ALLOWANCE
} from './constants';
import { summaryFetchSuccess } from './summaryData';
import { trancheMarketsToggle } from './tableData';
const { stakingSummary } = apiUri;

export const setAddress = (address) => (dispatch) => {
  if (address) {
    dispatch({
      type: SET_ADDRESS,
      payload: address.toLowerCase()
    });
    window.localStorage.setItem('address', address.toLowerCase());
  }
};

export const setNetwork = (network) => async (dispatch) => {
  const state = store.getState();
  const { path, ethereum } = state;
  const { address } = ethereum;
  dispatch({
    type: SET_NETWORK,
    payload: network
  });
  window.localStorage.setItem('network', network === 137 ? 'polygon' : 'ethereum');

  if (network === networkId && address) {
    store.dispatch(trancheMarketsToggle('compound'));
    if (path === 'stake') {
      const res = await axios(`${serverUrl + stakingSummary + address}`);
      const { result } = res.data;
      store.dispatch(summaryFetchSuccess(result));
    }
  }
  if (network === maticNetworkId) {
    store.dispatch(trancheMarketsToggle('aavePolygon'));
  }
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
    let { web3, network, maticWeb3 } = state.ethereum;
    web3 = network === maticNetworkId ? maticWeb3.http : web3;
    const Tokens =
      network === networkId
        ? ERC20Tokens.concat(CompTrancheTokens)
        : network === maticNetworkId
        ? PolygonBuyerCoinAddresses.concat(AaveTrancheTokens)
        : [];
    if (network === networkId || network === maticNetworkId) {
      const batch = new web3.BatchRequest();
      // const tokenBalance = {};
      Tokens.map((tokenAddress) => {
        let token = ERC20Setup(web3, tokenAddress);
        batch.add(
          token.methods.balanceOf(address).call.request({ from: address }, (err, res) => {
            if (err) {
              console.log('balanceCheck error');
              console.log(tokenAddress);
              console.error(err);
            } else {
              dispatch({
                type: SET_TOKEN_BALANCE,
                payload: { tokenAddress: tokenAddress.toLowerCase(), tokenBalance: res }
              });
            }
          })
        );
        return batch;
      });
      batch.execute();
    }
  } catch (error) {
    console.error(error);
  }
};

export const toggleApproval = (tokenAddress, contractAddress, bool) => async (dispatch) => {
  dispatch({
    type: SET_TRANCHE_ALLOWANCE,
    payload: { contractAddress, tokenAddress: tokenAddress.toLowerCase(), isApproved: bool }
  });
};

export const checkTrancheAllowances = (address, contractAddress) => async (dispatch) => {
  try {
    const state = store.getState();
    let { web3, network, maticWeb3 } = state.ethereum;
    if ((network === networkId && contractAddress === JAaveAddress) || (network === maticNetworkId && contractAddress === JCompoundAddress)) return;
    web3 = network === maticNetworkId ? maticWeb3.http : web3;
    const Tokens =
      network === networkId
        ? CompTrancheTokens.concat(TrancheBuyerCoinAddresses)
        : network === maticNetworkId
        ? AaveTrancheTokens.concat(PolygonBuyerCoinAddresses)
        : [];
    if (network === networkId || network === maticNetworkId) {
      const batch = new web3.BatchRequest();
      let tokenBalance = {};
      Tokens.map((tokenAddress) => {
        let token = ERC20Setup(web3, tokenAddress);
        batch.add(
          token.methods.balanceOf(address).call.request({ from: address }, (err, res) => {
            if (err) {
              console.log('allowanceCheck balance error');
              console.log(contractAddress, tokenAddress);
              console.error(err);
            } else {
              tokenBalance[tokenAddress] = res;
            }
          })
        );
        return batch;
      });
      Tokens.map((tokenAddress) => {
        let token = ERC20Setup(web3, tokenAddress);
        batch.add(
          token.methods.allowance(address, contractAddress).call.request({ from: address }, (err, res) => {
            if (err) {
              console.log('allowanceCheck allowance error');
              console.log(contractAddress, tokenAddress);
              console.error(err);
            } else {
              if ((isGreaterThan(res, tokenBalance[tokenAddress]) || isEqualTo(res, tokenBalance[tokenAddress])) && res !== '0') {
                dispatch({
                  type: SET_TRANCHE_ALLOWANCE,
                  payload: { contractAddress, tokenAddress: tokenAddress.toLowerCase(), isApproved: true }
                });
              } else {
                dispatch({
                  type: SET_TRANCHE_ALLOWANCE,
                  payload: { contractAddress, tokenAddress: tokenAddress.toLowerCase(), isApproved: false }
                });
              }
            }
          })
        );
        return batch;
      });
      batch.execute();
    }
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
