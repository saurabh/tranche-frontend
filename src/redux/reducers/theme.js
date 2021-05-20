import { CHANGE_THEME } from '../actions/constants';
import {initOnboard} from 'services/blocknative'

let theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark";

export default function (state = theme, action) {
  switch (action.type) {
      case CHANGE_THEME:
          localStorage.setItem("theme", state === 'light' ? 'dark' : 'light');
          const onboard = initOnboard();
          onboard.config({darkMode: state === 'light' ? true : false })
          return state === 'light' ? 'dark' : 'light';
      default:
          return state;
  }
}