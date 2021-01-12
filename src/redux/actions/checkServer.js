import { CHECK_SERVER } from './constants';


export const checkServer = (checkServerStatus) => (dispatch) => {
  dispatch({
    type: CHECK_SERVER,
    checkServerStatus
  });
};
