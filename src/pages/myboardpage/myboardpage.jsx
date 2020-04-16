import React, { Component } from 'react';

import { auth, firestore } from '../../firebase/firebase-utils';

import './myboardpage.scss';

import ImageGallery from '../../components/image-gallery/image-gallery';

class MyBoardPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	images: [],
            postCount: 0,
        	// currentUser: JSON.parse(localStorage.getItem('currentUser'))
        	// count: 0,
        	// i: 0
        };
        // this.getImages();
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

    getImages = (count=10) => { 
    	const localUser = JSON.parse(localStorage.getItem('currentUser'));	
    	const uid = localUser.id;
    	const userDocRef = firestore.collection(`users/${uid}/posts`);

	    userDocRef.orderBy('index', 'desc')
					.limit(count)
					.get()
					.then((snapShot) => {
						snapShot.forEach((doc) => {
							var data = doc.data();
							var src = data.mediaURL;
							var height = data.height;
							var width = data.width;
							var index = data.index;
							var text = data.text;
                            var imgUid = uid;
                            var name = data.fileName;
							var newImage = { src: src, height: height, width: width, index: index, text: text, uid: imgUid, name: name };
							this.setState({
								images: [...this.state.images, newImage],
							});
							// setImages([...images, newImage]);
							// console.log(Date.now() + " in getImages function: " + JSON.stringify(this.state.images));
						});
					})
					.catch((err) => {
						console.log(err);
					});
					// console.log('getImages ran --myboardpage: 107');
	    return;
    };

    render() {
    	// console.log(Date.now() + " in render: " + JSON.stringify(this.state.images));
        return (
            <div className='myboardpage'> 
	        	{auth.currentUser && <ImageGallery disabled={false} images={this.state.images} postCount={this.state.postCount} />}
        	</div>
        );
    }
}

export default MyBoardPage;
