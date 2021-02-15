import {
  CHANGE_FILTER,
  PAGINATION_SKIP,
  PAGINATION_CURRENT,
  CHANGE_OWN_ALL_FILTER,
  CHANGE_SORTING
} from './constants';

//Tobe optimized and merged into one file
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