import React, { Component } from 'react';
// import { render } from 'react-dom';
import debounce from 'lodash.debounce';

import { auth, firestore } from '../../firebase/firebase-utils';

import './myboardpage.scss';

import ImageGallery from '../../components/image-gallery/image-gallery';

class MyBoardPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	images: [],
            postCount: 0,
            error: false,
            hasMore: true,
            isLoading: false,
            someImages: [],
        };

        window.onscroll = debounce(() => {
            const {
                getImages,
                state: {
                    error,
                    isLoading,
                    hasMore,
                },
            } = this;

            if(error || isLoading || !hasMore) return;

            if(window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
                getImages();
            }
        }, 100);
    }

    componentDidMount() {
    	this.getImages();
        this.getMaxIndex();
    	// console.log(Date.now() + " component did mount: " + JSON.stringify(this.state.images));
    }

    getMaxIndex = () => {
        const localUser = JSON.parse(localStorage.getItem('currentUser'));  
        const uid = localUser.id;
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

    // getMoreImages = (count=10) => {
    //     console.log('got more images: ' + this.state.images.length);
    // };


    getImages = debounce((count=10) => { 
        this.setState({ isLoading: true });
        const postsLeft = (this.state.postCount + 1) - parseInt(this.state.images.length);
    	const localUser = JSON.parse(localStorage.getItem('currentUser'));	
    	const uid = localUser.id;
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
                            // console.log(JSON.stringify(this.state.someImages));
    						// snapShot.forEach((doc) => {
    						// 	var data = doc.data();
    						// 	var src = data.mediaURL;
    						// 	var height = data.height;
    						// 	var width = data.width;
    						// 	var index = data.index;
    						// 	var text = data.text;
          //                       var imgUid = uid;
          //                       var name = data.fileName;
          //                       var key = data.fileName;
    						// 	var newImage = { src: src, height: height, width: width, index: index, text: text, uid: imgUid, name: name, key: key };
    						// 	this.setState({
    						// 		images: [...this.state.images, newImage],
          //                           hasMore: (this.state.images.length < (this.state.postCount + 1)),
          //                           isLoading: false,
    						// 	});
    						// 	// setImages([...images, newImage]);
    						// 	// console.log(Date.now() + " in getImages function: " + JSON.stringify(this.state.images));
    						// });
          //                   console.log(JSON.stringify(this.state.images));
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
                            // snapShot.forEach((doc) => {
                            //     var data = doc.data();
                            //     var src = data.mediaURL;
                            //     var height = data.height;
                            //     var width = data.width;
                            //     var index = data.index;
                            //     var text = data.text;
                            //     var imgUid = uid;
                            //     var name = data.fileName;
                            //     var newImage = { src: src, height: height, width: width, index: index, text: text, uid: imgUid, name: name };
                            //     this.setState({
                            //         images: [...this.state.images, newImage],
                            //         hasMore: (this.state.images.length < this.state.postCount),
                            //         isLoading: false,
                            //     });
                            //     // console.log(postsLeft + ' filename: ' + name);
                            //     // setImages([...images, newImage]);
                            //     // console.log(Date.now() + " in getImages function: " + JSON.stringify(this.state.images));
                            // });
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

    render() {
        console.log('page rerendered');
    	// console.log(Date.now() + " in render: " + JSON.stringify(this.state.images));
        return (
            <div className='myboardpage'> 
	        	{auth.currentUser &&  <ImageGallery disabled={false} images={this.state.images} postCount={this.state.postCount} />}
                {this.state.error && <div>error</div>}
                {this.state.isLoading && <div>LOADING</div>}
                {!this.state.hasMore && <div>THE END</div>}
        	</div>
        );
    }
}

const container = document.createElement('div');
document.body.appendChild(container);
// render(<MyBoardPage />, container);

export default MyBoardPage;
