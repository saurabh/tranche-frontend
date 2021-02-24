import { combineReducers } from 'redux';
import alert from './alert';
import ethereum from './ethereum';
import data from './tableData';
import path from './TogglePath';
import checkServerStatus from './checkServer';

import { reducer as form } from 'redux-form';

export default combineReducers({
  path,
  alert,
  ethereum,
  data,
  checkServerStatus,
  form
});
