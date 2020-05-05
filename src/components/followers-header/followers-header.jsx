import React, { Component } from 'react';

import { firestore } from '../../firebase/firebase-utils';

import './followers-header.scss';

class FollowersHeader extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	followersCount: 0,
        }
    }

    componentDidMount() {
    	this.getFollowersCount();
    }

    getFollowersCount = (count=12) => {
    	const localUser = JSON.parse(localStorage.getItem('currentUser'));
		const localUid = localUser.id;    	

    	const followersRef = firestore.doc(`users/${localUid}`);

    	followersRef.get()
    				.then((snapshot) => {
    					const data = snapshot.data();
    					const followersCount = data.followers;

    					this.setState({
    						followersCount,
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
            <div className='followers-header'>
            	<span className='followers-text'>Followers:</span>
            	<span className='followers-count'>{this.state.followersCount}</span>
            </div>
        );
    }
}

export default FollowersHeader;
