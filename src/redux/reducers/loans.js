import {
  LOANS_IS_LOADING,
  LOANS_SUCCESS,
  LOANS_COUNT,
  CHANGE_FILTER,
  PAGINATION_SKIP,
  PAGINATION_CURRENT
} from '../actions/constants';

const initialState = {
  list: [],
  count: 0,
  isLoading: false,
  skip: 0,
  current: 1,
  limit: 20,
  filter: null
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOANS_SUCCESS:
      return { ...state, list: payload };
    case LOANS_COUNT:
      return { ...state, count: payload };
    case LOANS_IS_LOADING:
      return { ...state, isLoading: payload };
    case PAGINATION_SKIP:
      return { ...state, skip: payload };
    case PAGINATION_CURRENT:
      return { ...state, current: payload };
    case CHANGE_FILTER:
      return { ...state, filter: payload };
    default:
      return state;
  }
}
