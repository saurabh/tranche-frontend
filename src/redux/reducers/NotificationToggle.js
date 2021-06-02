import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../actions/constants';

export default function (state = [], action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
        return [action.payload];
    case REMOVE_NOTIFICATION:
        return [];
    default:
        return state;
  }
}
