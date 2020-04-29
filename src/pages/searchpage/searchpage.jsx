// import LoadingIndicator from '../../components/loading-indicator/loading-indicator';
// import ProgressBar from '../../components/progress-bar/progress-bar';

import React, { Component, PropTypes } from 'react';

import './searchpage.scss';

import SearchBar from '../../components/searchbar/searchbar';
import CustomButton from '../../components/custom-button/custom-button';

class SearchPage extends Component {


    constructor(props) {
        super(props);

        this.state = {
        	queryKeyword: '',
        	results: [],
        	hasMore: true,
        	isLoading: true,
        	error: false
        }
    }

    // onSearchChange = (event) => {
    // 	console.log(event.target.value);
    // };

    onSubmit = () => {
    	console.log('search clicked');
    };

    render() {
        return (
            <div className='searchpage'>
	        	<h3 style={{textDecoration: 'underline'}}>Discover something new</h3>
	        	<SearchBar id='searchpage-searchbar'/>
	        	<span><CustomButton className='search-page-submit-button custom-button' onClick={this.onSubmit}>search</CustomButton></span>
	        	<div className='search-results'>
	        		search results
	        	</div>
        	</div>
        );
    }
}

export default SearchPage;

