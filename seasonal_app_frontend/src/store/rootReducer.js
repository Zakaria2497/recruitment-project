/**
 * Root reducer - combines all slice reducers
 */
import { combineReducers } from '@reduxjs/toolkit';
import { authReducer, profileReducer } from './slices';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
});

export default rootReducer;

