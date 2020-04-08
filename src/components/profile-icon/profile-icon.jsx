import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { toggleProfileHidden } from '../../redux/profile/profile-actions';
import { selectUserImage } from '../../redux/user/user-selectors';

import { ReactComponent as DefaultIcon } from '../../assets/default-user.svg';

import './profile-icon.scss';

const ProfileIcon = ({ toggleProfileHidden }) => {
	const [userImg, setUserImg] = useState('');

	useEffect(() => {
		setUserImg(JSON.parse(localStorage.getItem('currentUser')).imageUrl)
	},[]);
	
    return (
        <div className='profile-icon' onClick={toggleProfileHidden}>
        	{ userImg ? <div className='icon-wrapper'><img src={userImg} alt='profile' className='user-icon' /></div> : <DefaultIcon className='icon' /> }
        </div>
    );
};


const mapDispatchToProps = dispatch => ({
	toggleProfileHidden: () => dispatch(toggleProfileHidden())
});


export default connect(null, mapDispatchToProps)(ProfileIcon);

