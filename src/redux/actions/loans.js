import { apiUri } from 'config/constants';
import { postRequest } from 'services/axios';
import {
  LOANS_IS_LOADING,
  LOANS_SUCCESS,
  LOANS_COUNT,
  CHANGE_FILTER,
  PAGINATION_SKIP,
  PAGINATION_CURRENT,
  CHANGE_OWN_ALL_FILTER
} from './constants';
const { loanList: loanListUrl } = apiUri;

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

export const changeFilter = (filter) => {
  return {
    type: CHANGE_FILTER,
    payload: filter
  };
};

export const changeOwnAllFilter = (filterType) => {
  return {
    type: CHANGE_OWN_ALL_FILTER,
    payload: filterType
  };
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

export const loansFetchData = (data) => async (dispatch) => {
  try {
    dispatch(loansIsLoading(true));
    const { data: result } = await postRequest(loanListUrl, { data }, null, true);
    dispatch(loansIsLoading(false));
    dispatch(loansFetchSuccess(result.result.list));
    dispatch(loansSetCount(result.result.count));
    return result;
  } catch (error) {
    //TODO : error handling
    console.log(error);
  }
};
