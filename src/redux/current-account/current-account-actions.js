import { CurrentAccountActionTypes } from './current-account-types';

export const setCurrentAccount = account => ({
	type: CurrentAccountActionTypes.SET_CURRENT_ACCOUNT,
	payload: account
});
