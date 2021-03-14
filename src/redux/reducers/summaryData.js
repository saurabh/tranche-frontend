import { SUMMARY_SUCCESS } from '../actions/constants';

const initialState = {
  slice: { balance: 0 },
  lp: { balance: 0 },
  withdrawn: { balance: 0 },
  lpList: undefined
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SUMMARY_SUCCESS:
      return payload;
    default:
      return state;
  }
}
