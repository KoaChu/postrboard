import { combineReducers } from 'redux';
// import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

import userReducer from './user/user-reducer';
import profileReducer from './profile/profile-reducer';

// const persistConfig = {
// 	key: 'root',
// 	storage,
// 	whitelist: ['user']
// }

export default combineReducers({
	user: userReducer,
	profileIcon: profileReducer,
})