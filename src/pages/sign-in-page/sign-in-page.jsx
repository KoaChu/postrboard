import React from 'react';

import './sign-in-page.scss';

import SignIn from '../../components/sign-in/sign-in';
import SignUp from '../../components/sign-up/sign-up';

const SignInPage = () => {
    return (
    	<div className='sign-in-page'>
	        <div className='sign-in-sign-up'>
	        	<SignIn />
	        	<SignUp />
	        </div>
        </div>
    );
};


export default SignInPage;
