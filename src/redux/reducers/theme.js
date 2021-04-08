import { CHANGE_THEME } from '../actions/constants';

let theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark";

export default function (state = theme, action) {
  switch (action.type) {
      case CHANGE_THEME:
          localStorage.setItem("theme", state === 'light' ? 'dark' : 'light');
          return state === 'light' ? 'dark' : 'light';
      default:
          return state;
  }
}