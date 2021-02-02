import { combineReducers } from 'redux';
import alert from './alert';
import ethereum from './ethereum';
import loans from './loans';
import tranches from './tranches';
import path from './TogglePath';
import trade from './trade';
import checkServerStatus from './checkServer';

import { reducer as form } from 'redux-form';

export default combineReducers({
  path,
  alert,
  ethereum,
  loans,
  tranches,
  trade,
  checkServerStatus,
  form
});
