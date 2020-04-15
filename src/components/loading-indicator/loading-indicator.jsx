import React from 'react';

import { ReactComponent as LoadingSpinner } from '../../assets/loading-indicator.svg';

import './loading-indicator.scss';

const LoadingIndicator = ({ loadingText='Loading' }) => {
    return (
    	<div className='loading-indicator'>
    		<div>
        		<LoadingSpinner className='loading-circle' />
        	</div>
    		<span className='loading-text'>{ loadingText }</span>
        </div>
    );
};

export default LoadingIndicator;
