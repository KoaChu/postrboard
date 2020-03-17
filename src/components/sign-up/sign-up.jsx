import React from 'react';

import './sign-up.scss';

import FormInput from '../form-input/form-input';
import CustomButton from '../custom-button/custom-button';

import { auth, createUserProfileDocument, firestore, createUsernameDocument, actionCodeSettings } from '../../firebase/firebase-utils';


class SignUp extends React.Component {
	constructor(){
		super();

		this.state = {
			displayName: '',
			email: '',
			password: '',
			confirmPassword: ''
		}
	}

	handleSubmit = async event => {
		event.preventDefault();

		const { displayName, email, password, confirmPassword } = this.state;

		const usernameRef = firestore.collection('usernames').doc(`${displayName}`);

		const usernameSnap = await usernameRef.get();

		if(usernameSnap.exists) {
			try {
		        alert("Username is already taken.");
		        return;
		      } catch (error) {
		        console.log('error with username check', error.message);
		      }
		}
		if(password !== confirmPassword) {
			alert("Passwords do not match.");
			return;
		}
		if(password.length < 6) {
			alert("Password must be at least 6 characters.");
			return;
		}
		if((/\s/.test(password)) || (/\s/.test(displayName)) || (/\s/.test(email))) {
			alert("Spaces not allowed in username or password.");
			return;
		}


		try {
			const { user } = await auth.createUserWithEmailAndPassword(email, password);
			//SEND EMAIL
			await createUserProfileDocument(user, {displayName});
			await createUsernameDocument(user, {displayName});

			// auth.user.sendEmailVerification(actionCodeSettings);

			this.setState({
			displayName: '',
			email: '',
			password: '',
			confirmPassword: ''
		});

		} catch (error) {
			console.error(error);
			alert("We had some trouble creating your account. Make sure the email was not previously used.")
		}
	};

	handleChange = event => {
		const { name, value } = event.target;

		this.setState({[name]: value});
	};

	render() {
		const { displayName, email, password, confirmPassword } = this.state;
		return(
			<div className='sign-up'>
				<h2 className='title'>Need an account?</h2>
				<span>Sign up with your email and password</span>
				<form className='sign-up-form' onSubmit={this.handleSubmit}>
					<FormInput type='text' name='displayName' value={displayName} onChange={this.handleChange} label='username' required/>
					<FormInput type='email' name='email' value={email} onChange={this.handleChange} label='email' required/>
					<FormInput type='password' name='password' value={password} onChange={this.handleChange} label='password' required/>
					<FormInput type='password' name='confirmPassword' value={confirmPassword} onChange={this.handleChange} label='confirm password' required/>
					<CustomButton type='submit'>sign up</CustomButton>
				</form>

			</div>
			)
	}
}


export default SignUp;

