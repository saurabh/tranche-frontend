import {
  LOANS_IS_LOADING,
  LOANS_SUCCESS,
  LOANS_COUNT,
  TRANCHES_IS_LOADING,
  TRANCHES_SUCCESS,
  TRANCHES_COUNT,
  STAKING_IS_LOADING,
  LPLIST_SUCCESS,
  STAKING_SUCCESS,
  STAKING_COUNT,
  CHANGE_FILTER,
  PAGINATION_SKIP,
  PAGINATION_CURRENT,
  CHANGE_OWN_ALL_FILTER,
  CHANGE_SORTING,
  OWN_ALL_TOGGLE,
  TRANCHE_CARD_TOGGLE,
  TRANCHE_MARKETS,
  USER_STAKING_LIST_SUCCESS,
  USER_STAKING_LIST_IS_LOADING,
  SET_TX_MODAL_OPEN,
  SET_TX_MODAL_TYPE,
  SET_TX_MODAL_DATA,
  SET_TX_MODAL,
  SET_TX_MODAL_LOADING,
  SET_TX_LINK,
  SET_MIGRATE_STEP,
  SET_MIGRATE_LOADING,
  SET_MIGRATED,
  SET_EXCHANGE_RATES
} from '../actions/constants';

let localNetwork = window.localStorage.getItem('network');
let filter = localNetwork ? localNetwork : null;

const initialState = {
  loansList: [],
  tranchesList: [],
  stakingList: [],
  sliceStakingList: [],
  count: 0,
  isLoading: false,
  skip: 0,
  current: 1,
  limit: 50,
  filter,
  sort: null,
  filterType: 'all',
  tradeType: 'allTranches',
  trancheCard: { status: false, id: null },
  trancheMarket: 'compound',
  txModalIsOpen: false,
  txModalType: '',
  txModalData: {},
  txModalStatus: 'initialState',
  txLoading: false,
  txLink: '',
  currentStep: 'claim',
  migrateLoading: false,
  userStakingList: {
    slice: [],
    lp: []
  },
  isUserStakingListLoading: false
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOANS_SUCCESS:
      return { ...state, loansList: payload };
    case LOANS_COUNT:
      return { ...state, count: payload };
    case LOANS_IS_LOADING:
      return { ...state, isLoading: payload };
    case TRANCHES_IS_LOADING:
      return { ...state, isLoading: payload };
    case TRANCHES_SUCCESS:
      return { ...state, tranchesList: payload };
    case TRANCHES_COUNT:
      return { ...state, count: payload };
    case TRANCHE_CARD_TOGGLE:
      return { ...state, trancheCard: payload };
    case STAKING_IS_LOADING:
      return { ...state, isLoading: payload };
    case LPLIST_SUCCESS:
      return { ...state, stakingList: payload };
    case STAKING_SUCCESS:
      return { ...state, sliceStakingList: payload };
    case STAKING_COUNT:
      return { ...state, count: payload };
    case PAGINATION_SKIP:
      return { ...state, skip: payload };
    case PAGINATION_CURRENT:
      return { ...state, current: payload };
    case CHANGE_FILTER:
      return { ...state, filter: payload };
    case CHANGE_SORTING:
      return { ...state, sort: payload };
    case CHANGE_OWN_ALL_FILTER:
      return { ...state, filterType: payload };
    case OWN_ALL_TOGGLE:
      return { ...state, tradeType: payload };
    case TRANCHE_MARKETS:
      return { ...state, trancheMarket: payload };
    case USER_STAKING_LIST_SUCCESS:
      return { ...state, userStakingList: payload };
    case USER_STAKING_LIST_IS_LOADING:
      return { ...state, isUserStakingListLoading: payload };
    case SET_TX_MODAL_OPEN:
      return { ...state, txModalIsOpen: payload };
    case SET_TX_MODAL_TYPE:
      return { ...state, txModalType: payload };
    case SET_TX_MODAL_DATA:
      return { ...state, txModalData: payload };
    case SET_TX_MODAL:
      return { ...state, txModalStatus: payload };
    case SET_TX_MODAL_LOADING:
      return { ...state, txLoading: payload };
    case SET_TX_LINK:
      return { ...state, txLink: payload };
    case SET_MIGRATE_STEP:
      return { ...state, currentStep: payload };
    case SET_MIGRATE_LOADING:
      return { ...state, migrateLoading: payload };
    case SET_MIGRATED:
      return { ...state, hasMigrated: payload };
    case SET_EXCHANGE_RATES:
      return { ...state, exchangeRates: payload };
    default:
      return state;
  }
}
