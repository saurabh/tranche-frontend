import { CHANGE_PATH } from '../actions/constants';

export default function (state = "borrow", action) {
  switch (action.type) {
      case CHANGE_PATH:
          return action.path;
      default:
          return state;
  }
}