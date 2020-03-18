import React, { Component } from 'react';

import FormInput from '../form-input/form-input';
import CustomButton from '../custom-button/custom-button';

import './profile-settings.scss';

class ProfileSettings extends Component {

    constructor() {
        super();

        this.state = {
        	imageUrl: '',
        }
    }

    render() {
        return (
        	<div className='profile-settings'>
	            <form className='sign-up-form' onSubmit={this.handleSubmit}>
					<input type='file' id='profile-image' className='hidden-input' onChange={this.handleChange} />
					<CustomButton type='button' 
					onClick={() => {
						document.getElementById('profile-image').click();
					}}>
					Change Profile Picture
					</CustomButton>
					<CustomButton type='submit'>save</CustomButton>
				</form>
			</div>
        );
    }
}

export default ProfileSettings;
