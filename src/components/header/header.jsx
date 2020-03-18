import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
// import { auth } from '../../firebase/firebase-utils';

// import { ReactComponent as Logo } from '../../assets/crwn-logo.svg';                 <Logo className='logo' />
import { selectCurrentUser } from '../../redux/user/user-selectors';
import { selectProfileHidden } from '../../redux/profile/profile-selectors';
import { toggleProfileHidden } from '../../redux/profile/profile-actions';

import ProfileIcon from '../profile-icon/profile-icon';
import ProfileDropdown from '../profile-dropdown/profile-dropdown';
import UploadIcon from '../upload-icon/upload-icon';

import './header.scss';

const Header = ({ currentUser, hidden, dispatch }) => {
    return (
        currentUser ?
            (<div className='header'>
                <Link className='logo-container' to="/" onClick={() => { dispatch(toggleProfileHidden()) }}>
                    LOGO
                </Link>
                <div className='options-container'>
                    <Link className='option' to='/featured' onClick={() => { dispatch(toggleProfileHidden()) }}>
                        Featured
                    </Link>
                    <Link className='option' to='/search' onClick={() => { dispatch(toggleProfileHidden()) }}>
                        Search
                    </Link>
                    <Link className='option' to='/' onClick={() => { dispatch(toggleProfileHidden()) }}>
                        Home
                    </Link>
                    <UploadIcon />
                    <ProfileIcon />
                </div>
                {hidden ? null : <ProfileDropdown />}
            </div>)
        : <div className='pre-logo'>postrboard</div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    hidden: selectProfileHidden
})

export default connect(mapStateToProps)(Header);
