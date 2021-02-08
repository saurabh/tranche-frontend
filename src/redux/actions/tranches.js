import { apiUri } from 'config/constants';
import { postRequest } from 'services/axios';
import { checkServer } from './checkServer';
import {
  TRANCHES_IS_LOADING,
  TRANCHES_SUCCESS,
  TRANCHES_COUNT,
  CHANGE_FILTER,
  PAGINATION_SKIP,
  PAGINATION_CURRENT,
  CHANGE_OWN_ALL_FILTER,
  CHANGE_SORTING
} from './constants';
const { tranchesList: tranchesistUrl } = apiUri;

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

export const tranchesFetchData = (data) => async (dispatch) => { //To be optimized and merged with loansFetchData 
  try {
    dispatch(tranchesIsLoading(true));
    const { data: result } = await postRequest(tranchesistUrl, { data }, null, true);
    if(result.status){
      dispatch(checkServer(true));
      dispatch(tranchesIsLoading(false));
      dispatch(tranchesFetchSuccess(result.result.list));
      dispatch(tranchesSetCount(result.result.count));
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
