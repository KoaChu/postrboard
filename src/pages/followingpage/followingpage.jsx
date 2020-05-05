import React, { Component, Fragment } from 'react';
import debounce from 'lodash.debounce'
import { Link } from 'react-router-dom';

import { firestore } from '../../firebase/firebase-utils';

import './followingpage.scss';

import FollowingHeader from '../../components/following-header/following-header';


class FollowingPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	lastFollowing: '',
        	following: [],
        	isLoading: true,
        	hasMore: true,
        	error: false,
        	followDisplayName: '',
        }
    }

    componentDidMount() {
    	this.fetchFollowing();
    }

    handleScroll = debounce((event) => {
    	const divRef = document.getElementById('following-results');

    	// console.log('scrollHeight: ' + divRef.scrollHeight + 'scrollTop: ' + divRef.scrollTop + 'clientHeight: ' + divRef.clientHeight);
    	if(this.state.error || this.state.isLoading || !this.state.hasMore) return;

    	if(divRef.scrollTop + divRef.clientHeight === divRef.scrollHeight) {
    		// console.log('bottom reached');
    		this.fetchFollowing(12);
    	}
    }, 100);

    handleMouseOver = (event) => {
    	this.setState({
    		followDisplayName: event.target.getAttribute('followkey'),
    	})
    	// console.log(event.target.getAttribute('followkey'));
    };

    handleClick = (event) => {
    	document.getElementById('following-item-link').click();
    };

    fetchFollowing = (count=12) => {
    	const localUser = JSON.parse(localStorage.getItem('currentUser'));
    	const localUid = localUser.id;

    	const followingRef = firestore.collection(`users/${localUid}/following`);

    	this.setState({
    		isLoading: true,
    	});

    	followingRef.orderBy('displayName')
    				.startAfter(this.state.lastFollowing)
    				.get()
    				.then((snapshot) => {
    					const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    					if(snapshot.empty) {
    						console.log('no following');
    						return;
    					} else {
    						const nextFollowing = snapshot.docs.map((doc) => ({
    							displayName: doc.data().displayName,
    							uid: doc.data().uid,
    							imageUrl: doc.data().imageUrl,
    						}));

    						this.setState({
    							isLoading: false,
    							following: this.state.following.concat(nextFollowing),
    							lastFollowing: lastDoc.data().displayName
    						});
    					}
    				})
    				.catch((err) => {
    					console.log(err.message);
    					this.setState({
							isLoading: false,
							following: [],
							lastFollowing: ''
						});
    				})
    };

    render() {
    	const {
    		error,
    		hasMore,
    		isLoading,
    		following,
    	} = this.state;

        return (
            <div className='followingpage'>
        		<FollowingHeader />
	        	<Link className='hidden-input' to={`/user/${this.state.followDisplayName}`} id='following-item-link' />
        		<div className='following-results' id='following-results' style={{userSelect: 'none'}} onScroll={this.handleScroll}>
	        		{following.map(follow => (
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

export default FollowingPage;
