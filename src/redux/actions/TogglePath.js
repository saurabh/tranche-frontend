import { CHANGE_PATH, CHANGE_OWN_ALL_FILTER } from './constants';

export const changePath = (path) => (dispatch) => {
    dispatch({
        type: CHANGE_PATH,
        path
    })
}

