import React from 'react';

import './settingspage.scss';

import ProfileSettings from '../../components/profile-settings/profile-settings';

const SettingsPage = () => {
    return (
        <div className='settingspage'>
        	<h2>Profile Settings</h2>
        	<ProfileSettings />
        </div>
    );
};

export default SettingsPage;
