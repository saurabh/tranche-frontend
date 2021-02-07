import {
  OWN_ALL_TOGGLE
} from '../actions/constants';
  
  const initialState = {
    tradeType: 'allTranches'
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case OWN_ALL_TOGGLE:
        return { ...state, tradeType: payload };
      default:
        return state;
    }
  }
  