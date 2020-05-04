import React from 'react';

import { CurrentAccountActionTypes } from './current-account-types';

const INITIAL_STATE = {
	currentAccount: null
}

const currentAccountReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
		case CurrentAccountActionTypes.SET_CURRENT_ACCOUNT:
			return {
				...state,
				currentAccount: action.payload
			}

		default:
			return state;
	}
};


export default currentAccountReducer;