import { LOANS_IS_LOADING, LOANS_SUCCESS, CHANGE_FILTER, PAGINATION_SKIP, PAGINATION_CURRENT } from '../actions/constants';

export function loansIsLoading(state = false, action) {
  switch (action.type) {
      case LOANS_IS_LOADING:
          return action.isLoading;

      default:
          return state;
  }
}
export function changeFilter(state = null, action) {
  switch (action.type) {
      case CHANGE_FILTER:
          return action.filter;

      default:
          return state;
  }
}

export function paginationOffset(state = 0, action) {
  switch (action.type) {
      case PAGINATION_SKIP:
          return action.skip;

      default:
          return state;
  }
}


export function paginationCurrent(state = 1, action) {
  switch (action.type) {
      case PAGINATION_CURRENT:
          return action.current;

      default:
          return state;
  }
}


export function loans(state = {list: [], count: 0}, action) {
  switch (action.type) {
      case LOANS_SUCCESS:
          return action.loans;

      default:
          return state;
  }
}