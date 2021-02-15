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
} from '../actions/constants';
import { initNotify } from 'services/blocknative';
import { web3 } from 'utils/getWeb3';

const initialState = {
  balance: -1,
  tokenBalance: { DAI: '0' },
  address: undefined,
  web3,
  notify: initNotify()
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ADDRESS:
      return { ...state, address: payload };
    case SET_NETWORK:
      return { ...state, network: payload };
    case SET_BALANCE:
      return { ...state, balance: payload };
    case SET_TOKEN_BALANCE:
      return { ...state, tokenBalance: { ...state.tokenBalance, [payload.tokenName]: payload.tokenBalance } };
    case SET_TOKEN_BALANCES:
      return { ...state, tokenBalance: payload };
    case SET_TRANCHE_TOKEN_BALANCES:
      return { ...state, trancheTokenBalance: { ...state.trancheTokenBalance, [payload.trancheName]: payload.trancheTokenBalance } };
    case SET_WALLET:
      return { ...state, wallet: payload };
    case SET_WEB3:
      return { ...state, web3: payload };
    case SET_CURRENT_BLOCK:
      return { ...state, currentBlock: payload };
    default:
      return state;
  }
}
