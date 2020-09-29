import { LOANS_IS_LOADING, LOANS_SUCCESS } from '../actions/constants';

export function loansIsLoading(state = false, action) {
  switch (action.type) {
      case LOANS_IS_LOADING:
          return action.isLoading;

      default:
          return state;
  }
}

export function loans(state = [], action) {
  switch (action.type) {
      case LOANS_SUCCESS:
          return action.loans;

      default:
          return state;
  }
}
