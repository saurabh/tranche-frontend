import { combineReducers } from 'redux';
import alert from './alert';
import ethereum from './ethereum';

export default combineReducers({
  alert,
  ethereum
});
