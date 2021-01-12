import {
  SELL_BUY_TOGGLE
} from './constants';

export const sellBuyToggle = (type) => (dispatch) => {
    dispatch({
      type: SELL_BUY_TOGGLE,
      payload: type
    });
};