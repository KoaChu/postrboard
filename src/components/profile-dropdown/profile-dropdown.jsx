import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { auth } from '../../firebase/firebase-utils';
import { toggleProfileHidden } from '../../redux/profile/profile-actions';

import CustomButton from '../custom-button/custom-button';

import './profile-dropdown.scss';


const ProfileDropdown = ({ history, dispatch, toggleProfileHidden }) => (
	<div className='profile-dropdown'>
		<div className='profile-items'>	
			<CustomButton>My Board</CustomButton>
			<CustomButton>Notes</CustomButton>
			<CustomButton>Following</CustomButton>
			<CustomButton>Followers</CustomButton>
			<CustomButton>Settings</CustomButton>	
			<CustomButton onClick={() => {
			auth.signOut();
			}}>
			Sign Out
			</CustomButton>	
		</div>
	</div>
	);

export default withRouter(ProfileDropdown);
