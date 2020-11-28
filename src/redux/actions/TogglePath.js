import { CHANGE_PATH } from './constants';

export const changePath = (path) => (dispatch) => {
    dispatch({
        type: CHANGE_PATH,
        path
    })
}

