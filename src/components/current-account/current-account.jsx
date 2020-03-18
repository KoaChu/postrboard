import React from 'react';

import './current-account.scss';

const CurrentAccount = () => {
    return (
        <div className='current-account'>
        	<img src='https://waxidentscandles.com/wp-content/uploads/2019/03/sample.png'
        		alt='account image'
        		className='account-image'
        		height='60'
        		width='60' />
        	<h5 className='account-name'>TESTING</h5>
        </div>
    );
};

export default CurrentAccount;
