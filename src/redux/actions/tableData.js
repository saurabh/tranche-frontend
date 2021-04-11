import { apiUri } from 'config/constants';
import { postRequest } from 'services/axios';
import { checkServer } from './checkServer';
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
  STAKING_SUCCESS,
  STAKING_COUNT,
  OWN_ALL_TOGGLE,
  TRANCHE_CARD_TOGGLE
} from './constants';
const { loanList: loanListUrl, tranchesList: tranchesListUrl, stakingList: stakingListUrl } = apiUri;

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
  dispatch({
    type: STAKING_SUCCESS,
    payload: list
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
  }
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

export const fetchTableData = (data, endpoint) => async (dispatch) => {
  try {
    dispatch(loansIsLoading(true));
    const { data: result } = await postRequest(endpoint, { data }, null, true);
    dispatch(checkServer(true));
    if(result.status){
      if(endpoint === loanListUrl){
        dispatch(loansIsLoading(false));
        dispatch(loansFetchSuccess(result.result.list));
        dispatch(loansSetCount(result.result.count));
      }
      else if(endpoint === tranchesListUrl){
        dispatch(tranchesIsLoading(false));
        dispatch(tranchesFetchSuccess(result.result.list));
        dispatch(tranchesSetCount(result.result.count));
      }
      else if(endpoint === stakingListUrl){
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
