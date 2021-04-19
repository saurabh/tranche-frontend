import {
  SET_ADDRESS,
  SET_NETWORK,
  SET_BALANCE,
  SET_TOKEN_BALANCE,
  SET_WALLET,
  SET_WEB3,
  SET_CURRENT_BLOCK,
  SET_TRANSACTION_LOADING,
  SET_TRANCHE_ALLOWANCE
} from '../actions/constants';
import { initNotify } from 'services/blocknative';
import { web3 } from 'utils/getWeb3';
import { SLICEAddress, LP1TokenAddress, LP2TokenAddress, TrancheTokenAddresses, TrancheBuyerCoinAddresses, zeroAddress } from 'config/constants';
const Tokens = TrancheTokenAddresses.concat(TrancheBuyerCoinAddresses);
let trancheAllowance = { [zeroAddress]: true };
Tokens.map((tokenAddress) => (trancheAllowance[tokenAddress.toLowerCase()] = false));

const initialState = {
  balance: -1,
  tokenBalance: { [SLICEAddress]: '0', [LP1TokenAddress]: '0', [LP2TokenAddress]: '0' },
  address: undefined,
  web3,
  notify: initNotify(),
  txOngoing: false,
  trancheAllowance
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
      return { ...state, tokenBalance: { ...state.tokenBalance, [payload.tokenAddress]: payload.tokenBalance } };
    case SET_TRANCHE_ALLOWANCE:
      return { ...state, trancheAllowance: { ...state.trancheAllowance, [payload.tokenAddress]: payload.isApproved } };
    case SET_WALLET:
      return { ...state, wallet: payload };
    case SET_WEB3:
      return { ...state, web3: payload };
    case SET_CURRENT_BLOCK:
      return { ...state, currentBlock: payload };
    case SET_TRANSACTION_LOADING:
      return { ...state, txOngoing: payload };
    default:
      return state;
  }
}
