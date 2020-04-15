import React from 'react';

import './searchpage.scss';

import LoadingIndicator from '../../components/loading-indicator/loading-indicator';

const SearchPage = () => {
    return (
        <div className='searchpage'>
        	<h1>Search Page</h1>
        	<LoadingIndicator />
        </div>
    );
};

export default SearchPage;
