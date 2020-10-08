import { SET_BORROWED_ASK_AMOUNT, SET_COLLATERAL_AMOUNT, SET_PAIR_ID } from './constants';

export const setBorrowedAskAmount = (amount) => (dispatch) => {
  dispatch({
    type: SET_BORROWED_ASK_AMOUNT,
    payload: amount
  });
};

export const setCollateralAmount = (amount) => (dispatch) => {
  dispatch({
    type: SET_COLLATERAL_AMOUNT,
    payload: amount
  });
};

export const setPairId = (pairId) => (dispatch) => {
  dispatch({
    type: SET_PAIR_ID,
    payload: pairId
  });
};
