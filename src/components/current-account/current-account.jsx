import React, { Component } from 'react';

import { firestore, firebaseFirestore } from '../../firebase/firebase-utils';

import './current-account.scss';

import CustomButton from '../custom-button/custom-button';
//'https://waxidentscandles.com/wp-content/uploads/2019/03/sample.png'

class CurrentAccount extends Component {

    constructor(props) {
        super(props);

        this.state = {
            followed: false,
            myAccount: '',
        }
    }

    componentDidMount() {
        const localUser = JSON.parse(localStorage.getItem('currentUser'));  
        const localUid = localUser.id;
        
        const userFollowedRef = firestore.collection(`users/${localUid}/following`);

        userFollowedRef.where('uid', '==', this.props.uid)
                        .limit(1)
                        .get()
                        .then((snapshot) => {
                            if(snapshot.size > 0) {
                                this.setState({
                                    followed: true,
                                });
                                // console.log('followed');
                            } else {
                                if(localUid === this.props.uid) {
                                    this.setState({
                                        myAccount: 'unselectable',
                                    });
                                }
                                return;
                            }
                            // console.log(snapshot.length);
                        })
                        .catch((err) => {
                            console.log('err in followed request: ' + err.message);
                        });
    }

    followClick = () => {
        const localUser = JSON.parse(localStorage.getItem('currentUser'));  
        const localUid = localUser.id;
        const localImageUrl = localUser.imageUrl;
        const localDisplayName = localUser.displayName;

        const localUserFollowingCountRef = firestore.doc(`users/${localUid}`);
        const currentAccountFollowersCountRef = firestore.doc(`users/${this.props.uid}`);
        const localUserFollowRef = firestore.doc(`users/${localUid}/following/${this.props.uid}`);
        const currentAccountFollowRef = firestore.doc(`users/${this.props.uid}/followers/${localUid}`);

        var image = this.props.imageUrl;

        if(!image){
            localUserFollowRef.set({
                uid: this.props.uid,
                displayName: this.props.displayName,
            })
            .then(() => {
                try {       
                    currentAccountFollowRef.set({
                    uid: localUid,
                    displayName: localDisplayName,
                    });
                    localUserFollowingCountRef.update({
                        following: firebaseFirestore.FieldValue.increment(1),
                    });
                    currentAccountFollowersCountRef.update({
                        followers: firebaseFirestore.FieldValue.increment(1),
                    });
                } catch(err) {
                    console.log(err.message);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });;
        } else {
            localUserFollowRef.set({
                uid: this.props.uid,
                displayName: this.props.displayName,
                imageUrl: this.props.imageUrl,
            })
            .then(() => {
                try {       
                    currentAccountFollowRef.set({
                    uid: localUid,
                    displayName: localDisplayName,
                    imageUrl: localImageUrl,
                    });
                    localUserFollowingCountRef.update({
                        following: firebaseFirestore.FieldValue.increment(1),
                    });
                    currentAccountFollowersCountRef.update({
                        followers: firebaseFirestore.FieldValue.increment(1),
                    });
                } catch(err) {
                    console.log(err.message);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
        }

        this.setState({
            followed: true,
        });;
        
        // console.log('followed');
    };

    unfollowClick = () => {
        const localUser = JSON.parse(localStorage.getItem('currentUser'));  
        const localUid = localUser.id;

        const localUserFollowRef = firestore.doc(`users/${localUid}/following/${this.props.uid}`);
        const currentAccountFollowRef = firestore.doc(`users/${this.props.uid}/followers/${localUid}`);
        const localUserFollowingCountRef = firestore.doc(`users/${localUid}`);
        const currentAccountFollowersCountRef = firestore.doc(`users/${this.props.uid}`);

        localUserFollowRef.delete();
        currentAccountFollowRef.delete();
        localUserFollowingCountRef.update({
            following: firebaseFirestore.FieldValue.increment(-1),
        });
        currentAccountFollowersCountRef.update({
            followers: firebaseFirestore.FieldValue.increment(-1),
        });

        this.setState({
            followed: false,
        });
        // console.log('unfollowed');
    };

    render() {
        return (
            <div className='current-account'>
                <div className='ca-wrapper'>
                    {/*<span className='follow-overlay'>
                        follow
                    </span>*/}
                    <img src={this.props.imageUrl}
                        alt={this.props.displayName}
                        className='account-image'
                        height='60'
                        width='60' 
                    />
                </div>
                <h5 className='account-name'>{this.props.displayName}</h5>
                {this.state.followed
                    ? <CustomButton className={`custom-button unfollow-button ${this.state.myAccount}`} onClick={this.unfollowClick}>unfollow</CustomButton>
                    : <CustomButton className={`custom-button follow-button ${this.state.myAccount}`} onClick={this.followClick}>follow</CustomButton>
                }
            {/*<CustomButton className='custom-button message-button'>contact</CustomButton>*/}
            </div>  
        );
    }
}

export default CurrentAccount;
