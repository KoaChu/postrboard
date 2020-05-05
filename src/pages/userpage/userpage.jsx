import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';

import { auth, firestore } from '../../firebase/firebase-utils';
import { setCurrentAccount } from '../../redux/current-account/current-account-actions';

import ImageGallery from '../../components/image-gallery/image-gallery';

import './userpage.scss';

class UserPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	pageDisplayName: this.props.match.params.displayName,
        	pageUid: '',
        	postCount: 0,
        	isLoading: true,
        	images: [],
        	error: false,
        	hasMore: true,
        };

        window.onscroll = debounce(() => {
            const {
                fetchImages,
                state: {
                    error,
                    isLoading,
                    hasMore,
                },
            } = this;

            if(error || isLoading || !hasMore) return;

            if(window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
                fetchImages();
            }
        }, 100);
    }

    componentDidMount(){
        const {setCurrentAccount} = this.props;
    	const pageUidRef = firestore.collection('users').where('displayName', '==', this.state.pageDisplayName).limit(1);
    	pageUidRef.get()
    			.then((snapshot) => {
    				snapshot.forEach((doc) => {

    					this.setState({
    						pageUid: doc.id,
    					});

                        const cA = {
                            displayName: doc.data().displayName,
                            imageUrl: doc.data().imageUrl,
                            uid: doc.id
                        };

                        setCurrentAccount(cA);
                        // if(cA.uid === localUid){
                        //     setCurrentAccount(null);
                        // } else {
                        //     setCurrentAccount(cA);
                        // }
    				});
    			})
    			.then(() => {
    				this.getMaxIndex();
    				this.fetchImages();
                    // console.log(JSON.parse(localStorage.getItem('currentUser')).displayName);
    			})
    			.catch((err) => {
    				console.log('Error mounting userpage: ' + err.message);
    			});
    	// console.log(this.state.pageDisplayName);
    }

    componentWillUnmount() {
        const {setCurrentAccount} = this.props;
        setCurrentAccount(null);
    }

    fetchImages = debounce((count=10) => { 
        this.setState({ isLoading: true });
        const postsLeft = (this.state.postCount + 1) - parseInt(this.state.images.length);
    	const uid = this.state.pageUid;
    	const userDocRef = firestore.collection(`users/${uid}/posts`);

        if(this.state.images.length === 0) {  
    	    userDocRef.orderBy('index', 'desc')
    					.limit(count)
    					.get()
    					.then((snapShot) => {
                            const nextImages = snapShot.docs.map(doc => ({
                                src: doc.data().mediaURL,
                                height: doc.data().height,
                                width: doc.data().width,
                                index: doc.data().index,
                                text: doc.data().text,
                                imguid: uid,
                                name: doc.data().fileName,
                                key: doc.data().fileName,
                            }));
                            this.setState({
                                images: this.state.images.concat(nextImages),
                                hasMore: (this.state.images.length < (this.state.postCount + 1)),
                                isLoading: false,
                             });
    					})
    					.catch((err) => {
                            this.setState({
                                isLoading: false,
                                error: err.message,
                            });
    						console.log(err);
    					});
        } else {
            userDocRef.where('index', '<', postsLeft)  
                        .orderBy('index', 'desc')
                        .limit(count)
                        .get()
                        .then((snapShot) => {
                            const nextImages = snapShot.docs.map(doc => ({
                                src: doc.data().mediaURL,
                                height: doc.data().height,
                                width: doc.data().width,
                                index: doc.data().index,
                                text: doc.data().text,
                                imguid: uid,
                                name: doc.data().fileName,
                                key: doc.data().fileName,
                            }));
                            this.setState({
                                images: this.state.images.concat(nextImages),
                                hasMore: (this.state.images.length < (this.state.postCount + 1)),
                                isLoading: false,
                             });
                        })
                        .catch((err) => {
                            this.setState({
                                isLoading: false,
                                error: err.message,
                            });
                            console.log(err);
                        });
            // console.log('images.length = ' + parseInt(this.state.images.length));
        }
    }, 100);

    getMaxIndex = () => {
        const uid = this.state.pageUid;
        const userDocRef = firestore.collection(`users/${uid}/posts`);

        userDocRef.orderBy('index', 'desc')
                    .limit(1)
                    .get()
                    .then((snapShot) => {
                        snapShot.forEach((doc) => {
                            var data = doc.data();
                            var postCount = data.index;
                            this.setState({
                                postCount: postCount,
                            });
                            // console.log(this.state.postCount);
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
    };

    render() {
        return (
            <div className='userpage'>
         		<div className='userpage'> 
		        	{auth.currentUser &&  <ImageGallery disabled={true} images={this.state.images} postCount={this.state.postCount} />}
	                {this.state.error && <div>error</div>}
	                {this.state.isLoading && <div>LOADING</div>}
	                {!this.state.hasMore && <div>THE END</div>}
        		</div>
 	        </div>
        );
    }
}

const container = document.createElement('div');
document.body.appendChild(container);

const mapDispatchToProps = dispatch => ({
  setCurrentAccount: account => dispatch(setCurrentAccount(account))
});

export default connect(null, mapDispatchToProps)(UserPage);
