import { combineReducers } from 'redux';
import alert from './alert';
import ethereum from './ethereum';
import { reducer as form } from 'redux-form';

export default combineReducers({
  alert,
  ethereum,
  form
});
