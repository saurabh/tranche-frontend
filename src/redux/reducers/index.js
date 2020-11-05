import { combineReducers } from 'redux';
import alert from './alert';
import ethereum from './ethereum';
import loans from './loans';
import path from './TogglePath';

import { reducer as form } from 'redux-form';

export default combineReducers({
  path,
  alert,
  ethereum,
  loans,
  form
});
