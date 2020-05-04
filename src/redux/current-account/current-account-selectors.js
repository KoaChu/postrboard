import { createSelector } from 'reselect';

const selectAccount = state => state.account;

export const selectCurrentAccount = createSelector(
	[selectAccount],
	(account) => account.currentAccount
	);

// export const selectUserImage = createSelector(
// 	[selectCurrentUser],
// 	currentUser =>
// 		currentUser.imageUrl
// 	);