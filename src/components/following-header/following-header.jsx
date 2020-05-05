import React, { Component } from 'react';

import { firestore } from '../../firebase/firebase-utils';

import './following-header.scss';

class FollowingHeader extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	followingCount: 0,
        }
    }

    componentDidMount() {
    	this.getFollowingCount();
    }

    getFollowingCount = (count=12) => {
    	const localUser = JSON.parse(localStorage.getItem('currentUser'));
		const localUid = localUser.id;    	

    	const followingRef = firestore.doc(`users/${localUid}`);

    	followingRef.get()
    				.then((snapshot) => {
    					const data = snapshot.data();
    					const followingCount = data.following;

    					this.setState({
    						followingCount,
    					});
    					// console.log(data.following);
    				})
    				.catch((err) => {
    					console.log(err.message);
    				});
    	// console.log('hi');
    };

    render() {
        return (
            <div className='following-header'>
            	<span className='following-text'>Following:</span>
            	<span className='following-count'>{this.state.followingCount}</span>
            </div>
        );
    }
}

export default FollowingHeader;
