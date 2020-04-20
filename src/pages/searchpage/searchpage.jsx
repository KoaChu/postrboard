import React from 'react';

import './searchpage.scss';

import LoadingIndicator from '../../components/loading-indicator/loading-indicator';
import ProgressBar from '../../components/progress-bar/progress-bar';

import { ReactComponent as Notes } from '../../assets/notes.svg';

const SearchPage = () => {
    return (
        <div className='searchpage'>
        	<h1>Search Page</h1>
        	<LoadingIndicator />
        	<ProgressBar />
        </div>
    );
};

export default SearchPage;
