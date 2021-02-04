import {
  OWN_ALL_TOGGLE
} from './constants';

export const ownAllToggle = (type) => (dispatch) => {
    dispatch({
      type: OWN_ALL_TOGGLE,
      payload: type
    });
};