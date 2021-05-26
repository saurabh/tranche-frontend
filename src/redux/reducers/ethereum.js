import {
  SET_ADDRESS,
  SET_NETWORK,
  SET_BALANCE,
  SET_TOKEN_BALANCE,
  SET_TOKEN_BALANCES,
  SET_WALLET,
  SET_WEB3,
  SET_CURRENT_BLOCK,
  SET_TRANSACTION_LOADING,
  SET_TRANCHE_ALLOWANCE,
  SET_BLOCKEXPLORER_URL
} from '../actions/constants';
import { initNotify } from 'services/blocknative';
import { web3 } from 'utils/getWeb3';
import maticWeb3 from 'utils/maticWeb3';
import {
  SLICEAddress,
  LP1TokenAddress,
  LP2TokenAddress,
  JCompoundAddress,
  CompTrancheTokens,
  TrancheBuyerCoinAddresses,
  JAaveAddress,
  AaveTrancheTokens,
  PolygonBuyerCoinAddresses
} from 'config/constants';

const CompTokens = CompTrancheTokens.concat(TrancheBuyerCoinAddresses);
const AaveTokens = AaveTrancheTokens.concat(PolygonBuyerCoinAddresses)
let compAllowance = {};
let aaveAllowance = {};
CompTokens.map((tokenAddress) => (compAllowance[tokenAddress.toLowerCase()] = false));
AaveTokens.map((tokenAddress) => (aaveAllowance[tokenAddress.toLowerCase()] = false));

const initialState = {
  balance: -1,
  tokenBalance: { [SLICEAddress]: '0', [LP1TokenAddress]: '0', [LP2TokenAddress]: '0' },
  address: undefined,
  web3,
  maticWeb3,
  notify: initNotify(),
  txOngoing: false,
  trancheAllowance: {
    [JCompoundAddress]: compAllowance,
    [JAaveAddress]: aaveAllowance
  }
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
    case SET_TOKEN_BALANCES:
      return { ...state, tokenBalance: payload };
    case SET_TRANCHE_ALLOWANCE:
      return {
        ...state,
        trancheAllowance: {
          ...state.trancheAllowance,
          [payload.contractAddress]: { ...state.trancheAllowance[payload.contractAddress], [payload.tokenAddress]: payload.isApproved }
        }
      };
    case SET_WALLET:
      return { ...state, wallet: payload };
    case SET_WEB3:
      return { ...state, web3: payload };
    case SET_BLOCKEXPLORER_URL:
      return { ...state, blockExplorerUrl: payload }
    case SET_CURRENT_BLOCK:
      return { ...state, currentBlock: payload };
    case SET_TRANSACTION_LOADING:
      return { ...state, txOngoing: payload };
    default:
      return state;
  }
}
