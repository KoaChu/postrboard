import React from 'react';
import { connect } from 'react-redux';

import { toggleProfileHidden } from '../../redux/profile/profile-actions';

import { ReactComponent as DefaultIcon } from '../../assets/default-user.svg';

import './profile-icon.scss';

const ProfileIcon = ({ toggleProfileHidden }) => {
    return (
        <div className='profile-icon' onClick={toggleProfileHidden}>
        	<DefaultIcon className='icon' />
        </div>
    );
};


const mapDispatchToProps = dispatch => ({
	toggleProfileHidden: () => dispatch(toggleProfileHidden())
});


export default connect(null, mapDispatchToProps)(ProfileIcon);

