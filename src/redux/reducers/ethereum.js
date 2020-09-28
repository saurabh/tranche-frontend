import Web3 from 'web3';
import {
  SET_ADDRESS,
  SET_NETWORK,
  SET_BALANCE,
  SET_WALLET,
  SET_WEB3
} from '../actions/constants';
import { initNotify } from 'services/blocknative';

const provider = new Web3.providers.HttpProvider(
  'https://kovan.infura.io/v3/b036e8717e624f5c826fdb9205e391d2'
);

const initialState = {
  balance: -1,
  address: undefined,
  web3: new Web3(provider),
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
    case SET_WALLET:
      return { ...state, wallet: payload };
    case SET_WEB3:
      return { ...state, web3: payload };
    default:
      return state;
  }
}
