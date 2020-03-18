import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase/firebase-utils';
import { toggleProfileHidden } from '../../redux/profile/profile-actions';
import { selectCurrentUser } from '../../redux/user/user-selectors';

import CustomButton from '../custom-button/custom-button';

import './profile-dropdown.scss';


const ProfileDropdown = ({ history, dispatch }) => (
	<div className='profile-dropdown'>
		<div className='profile-items'>	
			<Link className='item' to='/myboard' onClick={() => { dispatch(toggleProfileHidden()) }}>My Board</Link>
			<Link className='item' to='/notes' onClick={() => { dispatch(toggleProfileHidden()) }}>Notes</Link>
			<Link className='item' to='/following' onClick={() => { dispatch(toggleProfileHidden()) }}>Following</Link>
			<Link className='item' to='/followers' onClick={() => { dispatch(toggleProfileHidden()) }}>Followers</Link>
			<Link className='item' to='/settings' onClick={() => { dispatch(toggleProfileHidden()) }}>Settings</Link>
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
