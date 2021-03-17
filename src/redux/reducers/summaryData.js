import { SET_ACCRUED_REWARDS, SET_STAKABLE_ASSETS, SUMMARY_SUCCESS } from '../actions/constants';

const initialState = {
  slice: { balance: 0 },
  lp: { balance: 0 },
  withdrawn: { balance: 0 },
  lpList: undefined,
  stakableAssets: [],
  accruedRewards: {},
  totalAccruedRewards: 0,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SUMMARY_SUCCESS:
      return payload;
    case SET_ACCRUED_REWARDS:
      return { ...state, accruedRewards: payload.accruedRewards, totalAccruedRewards: payload.totalAccruedRewards };
    case SET_STAKABLE_ASSETS:
      return { ...state, stakableAssets: payload };
    default:
      return state;
  }
}
