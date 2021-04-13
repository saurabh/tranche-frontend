import { SET_ACCRUED_REWARDS, SET_SLICE_STATS, SET_STAKABLE_ASSETS, SET_TVL, SUMMARY_SUCCESS } from './constants';
import { getAccruedStakingRewards } from 'services/contractMethods';
import store from '../store';

export const summaryFetchSuccess = (summary) => (dispatch) => {
  const state = store.getState();
  const { address } = state.ethereum;
  const { slice, lpList } = summary;
  let stakableAssets = [];
  let rewards = {};
  let total = 0;

  stakableAssets = stakableAssets.concat(lpList);
  stakableAssets.unshift(slice);
  stakableAssets.forEach(async (item) => {
    let result = await getAccruedStakingRewards(item.yieldAddress, address);
    rewards[item.address] = result;
    total += Number(result);
    dispatch({
      type: SET_ACCRUED_REWARDS,
      payload: { accruedRewards: rewards, totalAccruedRewards: total }
    });
  });
  dispatch({
    type: SUMMARY_SUCCESS,
    payload: summary
  });
  dispatch({
    type: SET_STAKABLE_ASSETS,
    payload: stakableAssets
  });
};

export const setSliceStats = (sliceStats) => (dispatch) => {
  dispatch({
    type: SET_SLICE_STATS,
    payload: sliceStats
  });
};

export const setTvl = (tvl) => (dispatch) => {
  dispatch({
    type: SET_TVL,
    payload: tvl
  });
};
