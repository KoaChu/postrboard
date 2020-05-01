import React, { PropTypes } from 'react';

import './searchbar.scss';

const SearchBar = ({ searchChange, keyDown }) => {
    return (
        <div className='searchbar'>
        	<input
        		className='search-input'
        		id='search-input'
        		type='search'
        		placeholder='find a person or theme...'
        		onChange={searchChange}
                onKeyDown={keyDown}
        	/>
        </div>
    );
};

export default SearchBar;
