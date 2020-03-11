import { createSelector } from 'reselect';

const selectProfile = state => state.profileIcon;

export const selectProfileHidden = createSelector(
	[selectProfile],
	profile => profile.hidden
	)