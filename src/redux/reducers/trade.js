import {
    SELL_BUY_TOGGLE
} from '../actions/constants';
  
  const initialState = {
    tradeType: 'buy'
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case SELL_BUY_TOGGLE:
        return { ...state, tradeType: payload };
      default:
        return state;
    }
  }
  