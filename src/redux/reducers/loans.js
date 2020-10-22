import { LOANS_IS_LOADING, LOANS_SUCCESS, CHANGE_FILTER } from '../actions/constants';

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

export function loans(state = {list: [], count: 0}, action) {
  switch (action.type) {
      case LOANS_SUCCESS:
          return action.loans;

      default:
          return state;
  }
}
