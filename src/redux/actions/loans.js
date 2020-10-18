import { apiUri } from 'config/constants';
import { postRequest } from 'services/axios';
import { LOANS_IS_LOADING, LOANS_SUCCESS, CHANGE_FILTER } from './constants';
const { loanList: loanListUrl } = apiUri;

export const loansIsLoading = (bool) => (dispatch) => {
  dispatch({
    type: LOANS_IS_LOADING,
    isLoading: bool
  });
};

export const loansFetchSuccess = (loans) => (dispatch) => {
  dispatch({
    type: LOANS_SUCCESS,
    loans
  });
};

export const changeFilter = (filter)  => {
  return {
    type: CHANGE_FILTER,
    filter
  };
};

export const loansFetchData = (data) => async (dispatch) => {
  try {
    dispatch(loansIsLoading(true));
    const { data: result } = await postRequest(
      loanListUrl,
      { data },
      null,
      true
    );
    dispatch(loansIsLoading(false));
    dispatch(loansFetchSuccess(result.result));
    return result;
  } catch (error) {
    //TODO : error handling
    console.log(error);
  }
};
