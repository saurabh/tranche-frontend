import { SET_BORROWED_ASK_AMOUNT, SET_COLLATERAL_AMOUNT } from './constants';

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
