import React from 'react';

import './progress-bar.scss';

const ProgressBar = ({ progress=0 }) => {
    return (
        <div className='progress-bar'>
        	<div className='outer-progress'></div>
        	<div className='inner-progress' style={{ width: `${ progress }%` }}></div>
        </div>
    );
};


export default ProgressBar;
