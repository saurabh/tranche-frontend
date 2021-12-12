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
  SET_ALLOWANCE,
  SET_BLOCKEXPLORER_URL,
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION,
  UPDATE_NOTIFICATION_COUNT,
  REMOVE_NOTIFICATION,
  SIR_REWARDS
} from '../actions/constants';
import { initNotify } from 'services/blocknative';
import { web3 } from 'utils/getWeb3';
import maticWeb3 from 'utils/maticWeb3';
import fantomWeb3 from 'utils/fantomWeb3';
import avaxWeb3 from 'utils/avaxWeb3';
import {
  SLICEAddress,
  LP1TokenAddress,
  LP2TokenAddress,
  JCompoundAddress,
  CompTrancheTokens,
  TrancheBuyerCoinAddresses,
  JAaveAddress,
  AaveTrancheTokens,
  PolygonBuyerCoinAddresses,
  YearnTrancheTokens,
  FantomBuyerCoinAddresses,
  JYearnAddress,
  JAvalancheAddress,
  AvalancheTrancheTokens,
  AvalancheBuyerCoinAddresses
} from 'config/constants';

const CompTokens = CompTrancheTokens.concat(TrancheBuyerCoinAddresses);
const AaveTokens = AaveTrancheTokens.concat(PolygonBuyerCoinAddresses);
const YearnTokens = YearnTrancheTokens.concat(FantomBuyerCoinAddresses);
const AvalancheTokens = AvalancheTrancheTokens.concat(AvalancheBuyerCoinAddresses);

let compAllowance = {};
let aaveAllowance = {};
let yearnAllowance = {};

CompTokens.map((tokenAddress) => (compAllowance[tokenAddress.toLowerCase()] = false));
AaveTokens.map((tokenAddress) => (aaveAllowance[tokenAddress.toLowerCase()] = false));
YearnTokens.map((tokenAddress) => (yearnAllowance[ tokenAddress.toLowerCase() ] = false));

const avalancheAllowance = AvalancheTokens.reduce((acc, tokenAddress) => {
  acc[ tokenAddress.toLowerCase() ] = false;
  return acc;
}, {});

const initialState = {
  balance: -1,
  tokenBalance: { [ SLICEAddress ]: '0', [ LP1TokenAddress ]: '0', [ LP2TokenAddress ]: '0' },
  address: undefined,
  web3,
  maticWeb3,
  fantomWeb3,
  avaxWeb3,
  notify: initNotify(),
  txOngoing: false,
  tokenBalanceLoading: true,
  trancheAllowance: {
    [ JCompoundAddress ]: compAllowance,
    [ JAaveAddress ]: aaveAllowance,
    [ JYearnAddress ]: yearnAllowance,
    [ JAvalancheAddress ]: avalancheAllowance
  },
  notificationCount: 0,
  notifications: [],
  unclaimedSIRRewards: 0
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
    case SET_ALLOWANCE:
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
      return { ...state, blockExplorerUrl: payload };
    case SET_CURRENT_BLOCK:
      return { ...state, currentBlock: payload };
    case SET_TRANSACTION_LOADING:
      return { ...state, txOngoing: payload };
    case UPDATE_NOTIFICATION_COUNT:
      return { ...state, notificationCount: payload };
    case ADD_NOTIFICATION:
      return { ...state, notifications: [...state.notifications, payload] };
    case UPDATE_NOTIFICATION: {
      const newNotifications = [...state.notifications];
      newNotifications[payload.id] = payload;
      return { ...state, notifications: newNotifications };
    }
    case REMOVE_NOTIFICATION: {
      state.notifications.splice(payload, 1);
      return { ...state, notifications: [...state.notifications] };
    }
    case SIR_REWARDS: {
      return { ...state, unclaimedSIRRewards: payload };
    }
    default:
      return state;
  }
}
