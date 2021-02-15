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
  TRANCHES_COUNT
} from './constants';
const { loanList: loanListUrl, tranchesList: tranchesistUrl } = apiUri;

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
    if(result.status){
      dispatch(checkServer(true));
      if(endpoint === loanListUrl){
        dispatch(loansIsLoading(false));
        dispatch(loansFetchSuccess(result.result.list));
        dispatch(loansSetCount(result.result.count));
      }
      else if(endpoint === tranchesistUrl){
        dispatch(tranchesIsLoading(false));
        dispatch(tranchesFetchSuccess(result.result.list));
        dispatch(tranchesSetCount(result.result.count));
      }
    }
    else{
      dispatch(checkServer(false));
    }
    return result;
  } catch (error) {
    //TODO : error handling
    console.log(error);
    dispatch(checkServer(false));
  }
};
