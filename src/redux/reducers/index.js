import { combineReducers } from 'redux';
import alert from './alert';
import ethereum from './ethereum';
import { loans, loansIsLoading } from './loans';
import { changePath } from './TogglePath';

import { reducer as form } from 'redux-form';
import {
  SET_COLLATERAL_AMOUNT,
  SET_BORROWED_ASK_AMOUNT,
} from '../actions/constants';

export default combineReducers({
  alert,
  ethereum,
  loans,
  loansIsLoading,
  changePath,
  form: form.plugin({
    newLoan: (state, action) => {
      const { type, payload } = action;
      switch (type) {
        case SET_BORROWED_ASK_AMOUNT:
          return {
            ...state,
            values: { ...state.values, maxBorrowedAskAmount: payload }
          };
        case SET_COLLATERAL_AMOUNT:
          return {
            ...state,
            values: { ...state.values, minCollateralAmount: payload }
          };
        default:
          return state;
      }
    }
  })
});
