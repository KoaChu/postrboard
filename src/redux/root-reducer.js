import { combineReducers } from 'redux';

import userReducer from './user/user-reducer';
import profileReducer from './profile/profile-reducer';

export default combineReducers({
	user: userReducer,
	profileIcon: profileReducer,
})