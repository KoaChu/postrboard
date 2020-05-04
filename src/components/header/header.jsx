import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
// import { auth } from '../../firebase/firebase-utils';

// import { ReactComponent as Logo } from '../../assets/crwn-logo.svg';    <Logo className='logo' />
import { selectCurrentUser } from '../../redux/user/user-selectors';
import { selectProfileHidden } from '../../redux/profile/profile-selectors';
import { selectCurrentAccount } from '../../redux/current-account/current-account-selectors';

import ProfileIcon from '../profile-icon/profile-icon';
import ProfileDropdown from '../profile-dropdown/profile-dropdown';
import UploadIcon from '../upload-icon/upload-icon';
import CurrentAccount from '../current-account/current-account';


import { ReactComponent as Logo } from '../../assets/logo.svg';

import './header.scss';

const Header = ({ currentUser, hidden, currentAccount }) => {
    return (
        localStorage.getItem('currentUser') ?
            (<div className='header'>
                <Link className='logo-container' to="/">
                    <Logo className='postrboard-logo'/>
                    <span className='logo-text'>postrboard</span>
                </Link>
                {currentAccount && <CurrentAccount displayName={currentAccount.displayName} imageUrl={currentAccount.imageUrl} uid={currentAccount.uid}/>}
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
                    <UploadIcon className='upload-button' />
                    <ProfileIcon />
                </div>
                {hidden ? null : <ProfileDropdown />}
            </div>)
        : <div className='pre-logo'>
            <Logo className='postr-pre-logo'/>
            <span className='pre-text'>postrboard</span>
            </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    hidden: selectProfileHidden,
    currentAccount: selectCurrentAccount
})

export default connect(mapStateToProps)(Header);
