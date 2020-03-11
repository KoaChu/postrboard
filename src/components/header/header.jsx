import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { auth } from '../../firebase/firebase-utils';

// import { ReactComponent as Logo } from '../../assets/crwn-logo.svg';                 <Logo className='logo' />
import { selectCurrentUser } from '../../redux/user/user-selectors';
import { selectProfileHidden } from '../../redux/profile/profile-selectors';

import ProfileIcon from '../profile-icon/profile-icon';
import ProfileDropdown from '../profile-dropdown/profile-dropdown';

import './header.scss';

const Header = ({ currentUser, hidden }) => {
    return (
        currentUser ?
            (<div className='header'>
                <Link className='logo-container' to="/">
                    LOGO
                </Link>
                <div className='options-container'>
                    <Link className='option' to='/featured'>
                        Featured
                    </Link>
                    <Link className='option' to='/search'>
                        Search
                    </Link>
                    <Link className='option' to='/'>
                        Home
                    </Link>
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
