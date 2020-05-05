import React, { Component, Fragment } from 'react';
import debounce from 'lodash.debounce';
import { Link } from 'react-router-dom';

import { firestore } from '../../firebase/firebase-utils';

import FollowersHeader from '../../components/followers-header/followers-header';

import './followerspage.scss';


class FollowersPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	lastFollower: '',
        	followers: [],
        	isLoading: true,
        	hasMore: true,
        	error: false,
        	followDisplayName: '',
        }
    }

    componentDidMount() {
    	this.fetchFollowers();
    }

    handleScroll = debounce((event) => {
    	const divRef = document.getElementById('followers-results');

    	// console.log('scrollHeight: ' + divRef.scrollHeight + 'scrollTop: ' + divRef.scrollTop + 'clientHeight: ' + divRef.clientHeight);
    	if(this.state.error || this.state.isLoading || !this.state.hasMore) return;

    	if(divRef.scrollTop + divRef.clientHeight === divRef.scrollHeight) {
    		// console.log('bottom reached');
    		this.fetchFollowers(12);
    	}
    }, 100);

    handleMouseOver = (event) => {
    	this.setState({
    		followDisplayName: event.target.getAttribute('followkey'),
    	})
    	// console.log(event.target.getAttribute('followkey'));
    };

    handleClick = (event) => {
    	document.getElementById('followers-item-link').click();
    };

    fetchFollowers = (count=12) => {
    	const localUser = JSON.parse(localStorage.getItem('currentUser'));
    	const localUid = localUser.id;

    	const followingRef = firestore.collection(`users/${localUid}/followers`);

    	this.setState({
    		isLoading: true,
    	});

    	followingRef.orderBy('displayName')
    				.startAfter(this.state.lastFollower)
    				.get()
    				.then((snapshot) => {
    					const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    					if(snapshot.empty) {
    						console.log('no followers');
    						return;
    					} else {
    						const nextFollowers = snapshot.docs.map((doc) => ({
    							displayName: doc.data().displayName,
    							uid: doc.data().uid,
    							imageUrl: doc.data().imageUrl,
    						}));

    						this.setState({
    							isLoading: false,
    							followers: this.state.followers.concat(nextFollowers),
    							lastFollower: lastDoc.data().displayName
    						});
    					}
    				})
    				.catch((err) => {
    					console.log(err.message);
    					this.setState({
							isLoading: false,
							followers: [],
							lastFollower: ''
						});
    				})
    };

    render() {
    	const {
    		followers,
    		hasMore,
    		isLoading,
    		error,
    	} = this.state;
        return (
            <div className='followerspage'>
        		<FollowersHeader />
	        	<Link className='hidden-input' to={`/user/${this.state.followDisplayName}`} id='followers-item-link' />
        		<div className='followers-results' id='followers-results' style={{userSelect: 'none'}} onScroll={this.handleScroll}>
	        		{followers.map(follow => (
	        			<Fragment key={follow.uid}>
	        				<div followkey={follow.displayName}
	        					style={{display: 'flex',
	        							border: '1px solid black',
	        							width: '25%',
	        							justifyContent: 'center',
	        							alignItems: 'center',
	        							margin: '2vw',
	        					}}
	        					onMouseOver={this.handleMouseOver}
	        					onClick={this.handleClick}
	        					className='following-result-item'
	        				>
	        					<img alt={follow.displayName}
	    							src={follow.imageUrl}
	    							style={{
						                  borderRadius: '50%',
						                  border: '1px solid black',
						                  height: '2vw',
						                  marginRight: 5,
						                  marginLeft: 8,
						                  width: '2vw',
						                  pointerEvents: 'none',
						                }}
						        />
						        <div style={{pointerEvents: 'none',}}>
						        	<h5 style={{marginTop: '1.7vw'

						        	}}>
						        		@{follow.displayName}
						        	</h5>
						        </div>
	        				</div>
	        			</Fragment>
	        		))}
        		</div>
        	</div>
        );
    }
}

export default FollowersPage;

