import { CHECK_SERVER } from '../actions/constants';

export default function (state = true, action) {
  switch (action.type) {
      case CHECK_SERVER:
          return action.checkServerStatus;
      default:
          return state;
  }
}