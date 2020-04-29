import React, { PropTypes } from 'react';

import './searchbar.scss';

const SearchBar = ({ searchChange }) => {
    return (
        <div className='searchbar'>
        	<input
        		className='search-input'
        		type='search'
        		placeholder='find a @person or #theme...'
        		onChange={searchChange}
        	/>
        </div>
    );
};

export default SearchBar;
