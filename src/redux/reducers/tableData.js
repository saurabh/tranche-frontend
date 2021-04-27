import {
  LOANS_IS_LOADING,
  LOANS_SUCCESS,
  LOANS_COUNT,
  TRANCHES_IS_LOADING,
  TRANCHES_SUCCESS,
  TRANCHES_COUNT,
  STAKING_IS_LOADING,
  STAKING_SUCCESS,
  STAKING_COUNT,
  CHANGE_FILTER,
  PAGINATION_SKIP,
  PAGINATION_CURRENT,
  CHANGE_OWN_ALL_FILTER,
  CHANGE_SORTING,
  OWN_ALL_TOGGLE,
  TRANCHE_CARD_TOGGLE,
  TRANCHE_MARKETS
} from '../actions/constants';

const initialState = {
  loansList: [],
  tranchesList: [],
  stakingList: [],
  count: 0,
  isLoading: false,
  skip: 0,
  current: 1,
  limit: 50,
  filter: null,
  sort: null,
  filterType: 'all',
  tradeType: 'allTranches',
  trancheCard: { status: false, id: null },
  trancheMarket: "compound"
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
    case STAKING_SUCCESS:
      return { ...state, stakingList: payload };
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
    default:
      return state;
  }
}
