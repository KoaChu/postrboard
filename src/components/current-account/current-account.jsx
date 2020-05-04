import React from 'react';

import './current-account.scss';

import CustomButton from '../custom-button/custom-button';

const CurrentAccount = ({displayName, imageUrl, uid}) => {
    return (
        <div className='current-account'>
            <div className='ca-wrapper'>
                {/*<span className='follow-overlay'>
                    follow
                </span>*/}
            	<img src={imageUrl}
            		alt={displayName}
            		className='account-image'
            		height='60'
            		width='60' 
                />
            </div>
        	<h5 className='account-name'>{displayName}</h5>
            <CustomButton className='custom-button follow-button'>follow</CustomButton>
        {/*<CustomButton className='custom-button message-button'>contact</CustomButton>*/}
        </div>
    );
};

export default CurrentAccount;

//'https://waxidentscandles.com/wp-content/uploads/2019/03/sample.png'