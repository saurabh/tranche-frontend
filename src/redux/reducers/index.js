import { combineReducers } from 'redux';
import alert from './alert';
import ethereum from './ethereum';
import { loans, loansIsLoading, changeFilter, paginationOffset, paginationCurrent } from './loans';
import { changePath } from './TogglePath';

import { reducer as form } from 'redux-form';

export default combineReducers({
  alert,
  ethereum,
  loans,
  loansIsLoading,
  changePath,
  changeFilter,
  paginationOffset,
  paginationCurrent,
  form
});
