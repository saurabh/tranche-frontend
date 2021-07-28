import store from '../store';
import {
  networkId,
  maticNetworkId,
  apiUri,
  SLICEAddress,
  LP1TokenAddress,
  LP2TokenAddress,
  etherScanUrl,
  maticBlockExplorerUrl
} from 'config/constants';
import { postRequest, initOnboard, getRequest } from 'services';
import { checkServer } from './checkServer';
import { setBlockExplorerUrl } from './ethereum';
import {
  LOANS_IS_LOADING,
  LOANS_SUCCESS,
  LOANS_COUNT,
  CHANGE_FILTER,
  PAGINATION_SKIP,
  PAGINATION_CURRENT,
  CHANGE_OWN_ALL_FILTER,
  CHANGE_SORTING,
  TRANCHES_IS_LOADING,
  TRANCHES_SUCCESS,
  TRANCHES_COUNT,
  STAKING_IS_LOADING,
  LPLIST_SUCCESS,
  STAKING_COUNT,
  OWN_ALL_TOGGLE,
  TRANCHE_CARD_TOGGLE,
  TRANCHE_MARKETS,
  STAKING_SUCCESS,
  USER_STAKING_LIST_IS_LOADING,
  USER_STAKING_LIST_SUCCESS,
  SET_TX_MODAL_OPEN,
  SET_TX_MODAL_TYPE,
  SET_TX_MODAL_DATA,
  SET_TX_MODAL,
  SET_TX_MODAL_LOADING,
  SET_MIGRATE_STEP,
  SET_MIGRATE_LOADING,
  SET_MIGRATED,
  SET_EXCHANGE_RATES
} from './constants';
const { loanList: loanListUrl, tranchesList: tranchesListUrl, stakingList: stakingListUrl, exchangeRates } = apiUri;

export const fetchExchangeRates = () => async (dispatch) => {
  const { data: result } = await getRequest(exchangeRates, {}, null);
  dispatch({
    type: SET_EXCHANGE_RATES,
    payload: result.result
  });
};

export const loansIsLoading = (bool) => (dispatch) => {
  dispatch({
    type: LOANS_IS_LOADING,
    payload: bool
  });
};

export const loansFetchSuccess = (list) => (dispatch) => {
  dispatch({
    type: LOANS_SUCCESS,
    payload: list
  });
};

export const loansSetCount = (count) => (dispatch) => {
  dispatch({
    type: LOANS_COUNT,
    payload: count
  });
};

export const tranchesIsLoading = (bool) => (dispatch) => {
  dispatch({
    type: TRANCHES_IS_LOADING,
    payload: bool
  });
};

export const tranchesFetchSuccess = (list) => (dispatch) => {
  dispatch({
    type: TRANCHES_SUCCESS,
    payload: list
  });
};

export const tranchesSetCount = (count) => (dispatch) => {
  dispatch({
    type: TRANCHES_COUNT,
    payload: count
  });
};

export const trancheCardToggle = (obj) => (dispatch) => {
  dispatch({
    type: TRANCHE_CARD_TOGGLE,
    payload: obj
  });
};

export const stakingIsLoading = (bool) => (dispatch) => {
  dispatch({
    type: STAKING_IS_LOADING,
    payload: bool
  });
};

export const stakingFetchSuccess = (list) => (dispatch) => {
  const searchArr = (tokenAddress) => list.filter((i) => i.duration === undefined).find((i) => i.tokenAddress === tokenAddress);
  const sliceList = list.filter((i) => i.duration);
  sliceList.push(searchArr(SLICEAddress));
  const lpList = [];
  lpList.push(searchArr(LP1TokenAddress));
  lpList.push(searchArr(LP2TokenAddress));
  dispatch({
    type: LPLIST_SUCCESS,
    payload: lpList
  });
  dispatch({
    type: STAKING_SUCCESS,
    payload: sliceList
  });
};
export const stakingSetCount = (count) => (dispatch) => {
  dispatch({
    type: STAKING_COUNT,
    payload: count
  });
};

export const changeFilter = (filter) => {
  return {
    type: CHANGE_FILTER,
    payload: filter
  };
};

export const changeSorting = (sort) => {
  return {
    type: CHANGE_SORTING,
    payload: sort
  };
};

export const ownAllToggle = (type) => (dispatch) => {
  dispatch({
    type: OWN_ALL_TOGGLE,
    payload: type
  });
};

export const changeOwnAllFilter = (filterType) => (dispatch) => {
  dispatch({
    type: CHANGE_OWN_ALL_FILTER,
    payload: filterType
  });
};

export const paginationOffset = (skip) => (dispatch) => {
  dispatch({
    type: PAGINATION_SKIP,
    payload: skip
  });
};

export const paginationCurrent = (current) => (dispatch) => {
  dispatch({
    type: PAGINATION_CURRENT,
    payload: current
  });
};

export const trancheMarketsToggle = (trancheMarket) => (dispatch) => {
  const onboard = initOnboard();
  if (trancheMarket === 'compound') {
    onboard.config({ networkId });
    store.dispatch(changeFilter('ethereum'));
    store.dispatch(setBlockExplorerUrl(etherScanUrl));
  } else if (trancheMarket === 'aavePolygon') {
    onboard.config({ networkId: maticNetworkId });
    store.dispatch(changeFilter('polygon'));
    store.dispatch(setBlockExplorerUrl(maticBlockExplorerUrl));
  }
  store.dispatch(trancheCardToggle({ status: false, id: null }));
  dispatch({
    type: TRANCHE_MARKETS,
    payload: trancheMarket
  });
};

const fetchUserStakingListSuccess = (userStakingList) => (dispatch) => {
  const sliceStakes = userStakingList.find((l) => l.tokenAddress === SLICEAddress);
  const slice = sliceStakes ? sliceStakes.stakes : [];
  const lp1Stakes = userStakingList.find((l) => l.tokenAddress === LP1TokenAddress);
  const lp2Stakes = userStakingList.find((l) => l.tokenAddress === LP2TokenAddress);
  const lp = lp1Stakes ? lp1Stakes.stakes : [];
  if (lp2Stakes) {
    lp.push(...(lp2Stakes.stakes || []));
  }

  dispatch({
    type: USER_STAKING_LIST_SUCCESS,
    payload: { slice, lp }
  });
};

const userStakingListIsLoading = (bool) => (dispatch) => {
  dispatch({
    type: USER_STAKING_LIST_IS_LOADING,
    payload: bool
  });
};
export const fetchTableData = (data, endpoint) => async (dispatch) => {
  try {
    dispatch(loansIsLoading(true));
    const { data: result } = await postRequest(endpoint, { data }, null, true);
    dispatch(checkServer(true));
    if (result.status) {
      if (endpoint === loanListUrl) {
        dispatch(loansIsLoading(false));
        dispatch(loansFetchSuccess(result.result.list));
        dispatch(loansSetCount(result.result.count));
      } else if (endpoint === tranchesListUrl) {
        dispatch(tranchesIsLoading(false));
        dispatch(tranchesFetchSuccess(result.result.list));
        dispatch(tranchesSetCount(result.result.count));
      } else if (endpoint === stakingListUrl) {
        dispatch(stakingIsLoading(false));
        dispatch(stakingFetchSuccess(result.result.list));
        dispatch(stakingSetCount(result.result.count));
      }
    }
    return result;
  } catch (error) {
    //TODO : error handling
    console.log(error);
    dispatch(checkServer(false));
  }
};

export const fetchUserStakingList = (endpoint) => async (dispatch) => {
  try {
    dispatch(userStakingListIsLoading(true));
    const { data: result } = await getRequest(endpoint, {}, null);
    if (result.status) {
      dispatch(userStakingListIsLoading(false));
      dispatch(fetchUserStakingListSuccess(result.result.list));
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const setMigrateStep = (string) => (dispatch) => {
  const state = store.getState();
  const { address } = state.ethereum;
  if (string === 'done') {
    const migrateAddress = JSON.parse(window.localStorage.getItem('migrateAddress'));
    window.localStorage.setItem(`migrateAddress`, JSON.stringify({ ...migrateAddress, [address]: true }));
    dispatch({
      type: SET_MIGRATED,
      payload: true
    });
  }
  dispatch({
    type: SET_MIGRATE_STEP,
    payload: string
  });
};

export const setMigrateLoading = (bool) => (dispatch) => {
  dispatch({
    type: SET_MIGRATE_LOADING,
    payload: bool
  });
};

export const setHasMigrated = (bool) => (dispatch) => {
  dispatch({
    type: SET_MIGRATED,
    payload: bool
  });
};

export const setTxModalOpen = (bool) => (dispatch) => {
  dispatch({
    type: SET_TX_MODAL_OPEN,
    payload: bool
  });
};

export const setTxModalType = (string) => (dispatch) => {
  dispatch({
    type: SET_TX_MODAL_TYPE,
    payload: string
  });
};

export const setTxModalData = (object) => (dispatch) => {
  dispatch({
    type: SET_TX_MODAL_DATA,
    payload: object
  });
};

export const setTxModalStatus = (string) => (dispatch) => {
  dispatch({
    type: SET_TX_MODAL,
    payload: string
  });
};

export const setTxModalLoading = (bool) => (dispatch) => {
  dispatch({
    type: SET_TX_MODAL_LOADING,
    payload: bool
  });
};
