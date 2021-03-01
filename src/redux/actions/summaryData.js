import {SUMMARY_SUCCESS} from './constants'

export const summaryFetchSuccess = (summary) => (dispatch) => {
  dispatch({
    type: SUMMARY_SUCCESS,
    payload: summary
  });
};
