import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';

import { toggleProfileHidden } from '../../redux/profile/profile-actions';

import { ReactComponent as DefaultIcon } from '../../assets/default-user.svg';

import './profile-icon.scss';

const ProfileIcon = ({ toggleProfileHidden }) => {
	const [userImg, setUserImg] = useState(JSON.parse(localStorage.getItem('currentUser')).imageUrl);

	useEffect(() => {
		setUserImg(JSON.parse(localStorage.getItem('currentUser')).imageUrl)
	},[userImg]);

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

