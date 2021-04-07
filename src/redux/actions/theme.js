import { CHANGE_THEME } from './constants';

export const changeTheme = () => (dispatch) => {
    dispatch({
        type: CHANGE_THEME
    })
}