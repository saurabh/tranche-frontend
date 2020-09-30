import { apiUri } from 'config/constants';
import { postRequest } from 'services/axios';
import { LOANS_IS_LOADING, LOANS_SUCCESS } from './constants';
const { loanList: loanListUrl } = apiUri;

export function loansIsLoading(bool) {
  return {
    type: LOANS_IS_LOADING,
    isLoading: bool
  };
}

export function loansFetchSuccess(loans) {
  return {
    type: LOANS_SUCCESS,
    loans
  };
}

export function loansFetchData(data) {
  return async (dispatch) => {
    dispatch(loansIsLoading(true));
    try {
      const { data: result } = await postRequest(
        loanListUrl,
        { data },
        null,
        true
      );
      dispatch(loansIsLoading(false));
      dispatch(loansFetchSuccess(result.result.list));
      return result;
    } catch (error) {
      //TODO : error handling
      console.log(error);
    }
  };
}
