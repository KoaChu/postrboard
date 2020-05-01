// import LoadingIndicator from '../../components/loading-indicator/loading-indicator';
// import ProgressBar from '../../components/progress-bar/progress-bar';

import React, { Component, Fragment } from 'react';
import { firestore } from '../../firebase/firebase-utils';

import './searchpage.scss';

import SearchBar from '../../components/searchbar/searchbar';
import CustomButton from '../../components/custom-button/custom-button';

class SearchPage extends Component {


    constructor(props) {
        super(props);

        // this.searchTextAreaRef = React.createRef();

        this.state = {
        	// queryKeyword: '',
        	queryOption: '',
        	results: [],
        	hasMore: true,
        	isLoading: false,
        	error: false,
        	lastDisplayName: '',
        }
    }

    // onSearchChange = (event) => {
    // 	console.log(event.target.value);
    // };

    onSubmit = () => {
    	this.setState({
    			isLoading: true,
    	});
    	const queryKey = document.getElementById('search-input').value;

		if(queryKey === null || queryKey === '') {
			this.setState({
				isLoading: false,
				results: [],
				lastDisplayName: '',
			});
			return;
		}
		if(this.state.queryOption === 'all' || this.state.queryOption === '') {
			// console.log('all ' + queryKey);
			firestore.collection('users')
					.where('displayName', '>=', queryKey)
					.orderBy('displayName')
					.startAfter(this.state.lastDisplayName)
					.limit(12)
					.get()
					.then((snapshot) => {
						const last = snapshot.docs[snapshot.docs.length - 1];
						const nextResults = snapshot.docs.map(doc => ({
							displayName: doc.data().displayName,
							imageUrl: doc.data().imageUrl
						}));

						this.setState({
							results: this.state.results.concat(nextResults),
							isLoading: false,
							lastDisplayName: last.data().displayName,
						})
					})
					.catch((err) => {
						console.log('err in search query: ' + err.message);
						this.setState({
							isLoading: false,
							lastDisplayName: '',
						});
					});
		}
		else if(this.state.queryOption === 'person'){
			console.log('person ' + queryKey)
		}
		else if(this.state.queryOption === 'theme') {
			console.log('theme ' + queryKey);
		}
		// if(queryKey.includes('#')) {
		// 	console.log('contains #');
		// }
		// if(queryKey.includes('@')) {
		// 	console.log('contains @');
		// }
    };

    handleSearchOption = (event) => {
    	event.preventDefault();
    	// console.log(event.target.value);

    	switch (event.target.value) {
    		case '0':
    			this.setState({
    				queryOption: 'all'
    			});
    			break;
    		case '1':
    			this.setState({
    				queryOption: 'person'
    			});
    			break;
    		case '2':
    			this.setState({
    				queryOption: 'theme'
    			});
    			break;
    		default:
    			this.setState({
    				queryOption: 'all'
    			});
    			break;
    	}
    };

    render() {

    	const {
    		results,
    		isLoading,
    		error,
    		hasMore
    	} = this.state;

        return (
            <div className='searchpage'>
	        	<h3 style={{textDecoration: 'underline'}}>Discover something new</h3>
	        	<SearchBar id='searchpage-searchbar' />
	        	<select className='option-search-select' onChange={this.handleSearchOption}>
        			<option value='0' default>all</option>
        			<option value='1'>person</option>
        			<option value='2'>theme</option>
    			</select>
	        	<span><CustomButton className='search-page-submit-button custom-button' onClick={this.onSubmit}>search</CustomButton></span>
	        	<div className='search-results' style={{color: 'black'}}>
	        		{this.state.results.length===0 && 'search results'}
	        		{results.map(result => (
	        				<Fragment key={result.displayName}>
	        					<hr />
	        					<div style={{display: 'flex',
	        								alignItems: 'center',
	        								justifyContent: 'center',
	        								cursor: 'pointer',
	        								border: '2px solid black',
	        								borderRadius: '100pt 100pt 100pt 100pt',
	        								width: '25%',
	        								background: 'white',
	        								}}
	        						 notekey={result.displayName}
	        						 className='result-item'
	        					>
	        						<img onerror="this.style.display='none'"
	        							src={result.imageUrl}
	        							style={{
							                  borderRadius: '50%',
							                  border: '1px solid black',
							                  height: '4.5vw',
							                  marginRight: 5,
							                  marginLeft: 8,
							                  width: '4.5vw',
							                  transform: 'translate(-10%, 0%)',
							                }}
							        />
							        <div>
							        	<h5 style={{marginTop: '2.5vw',
							                  		transform: 'translate(-10%, 0%)',
							                  		fontSize: '1vw',
							        		}}>
							        		@{result.displayName}
							        	</h5>
							        </div>
	        					</div>
	        				</Fragment>
	        			))}
	        			<hr />
	        	</div>
        	</div>
        );
    }
}

export default SearchPage;

