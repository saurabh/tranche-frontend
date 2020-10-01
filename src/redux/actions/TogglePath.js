import { CHANGE_PATH } from './constants';

export function changePath(path) {
    return {
        type: CHANGE_PATH,
        path
    };
}

