import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { auth } from '../../firebase/firebase-utils';
import { toggleProfileHidden } from '../../redux/profile/profile-actions';
import { selectCurrentUser } from '../../redux/user/user-selectors';

import CustomButton from '../custom-button/custom-button';

import './profile-dropdown.scss';


const ProfileDropdown = ({ history, dispatch }) => (
	<div className='profile-dropdown'>
		<div className='profile-items'>	
			<CustomButton>My Board</CustomButton>
			<CustomButton>Notes</CustomButton>
			<CustomButton>Following</CustomButton>
			<CustomButton>Followers</CustomButton>
			<CustomButton>Settings</CustomButton>	
			<CustomButton onClick={() => {
			auth.signOut();
			dispatch(toggleProfileHidden());
			}}>
			Sign Out
			</CustomButton>	
		</div>
	</div>
	);

const mapStateToProps = createStructuredSelector({
	user: selectCurrentUser
});

export default withRouter(connect(mapStateToProps)(ProfileDropdown));
