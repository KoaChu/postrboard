import { createSelector } from 'reselect';

const selectUser = state => state.user;

export const selectCurrentUser = createSelector(
	[selectUser],
	(user) => user.currentUser
	);

export const selectUserImage = createSelector(
	[selectCurrentUser],
	currentUser =>
		currentUser.imageUrl
	);