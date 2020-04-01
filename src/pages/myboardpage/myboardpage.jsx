// import React, { useState, useEffect } from 'react';
// import { auth, firestore } from '../../firebase/firebase-utils';

// import './myboardpage.scss';

// import ImageGallery from '../../components/image-gallery/image-gallery';

// const MyBoardPage = () => {
// 	const [images, setImages] = useState([{}]);
// 	const [count, setCount] = useState(0);

//     const userDocRef = firestore.collection(`users/${auth.currentUser.uid}/posts`);

//     const increment = () => {
//     	setCount(count+1);
//     }

//     const getImages = (count=5) => { 	

// 	    var userImages = userDocRef
// 	    				.orderBy('createdAt')
// 	    				.limit(count)
// 	    				.get()
// 	    				.then((snapShot) => {
// 	    					snapShot.forEach((doc) => {
// 	    						var data = doc.data();
// 	    						var src = data.mediaURL;
// 	    						var height = data.height;
// 	    						var width = data.width;
// 	    						var newImage = [...newImage, { src: src, height: height, width: width }]
// 	    						// setImages([...images, newImage]);
// 	    						console.log(images);
// 	    					});
// 	    				})
// 	    				.catch((err) => {
// 	    					console.log(err);
// 	    				});

// 	    return;
//     };
    
//     React.useEffect(() => {
//     	getImages();
//     }, []);

//     return (
//         <div className='myboardpage'>
//         	{/*<h3>{count}</h3>
//         	        	<button onClick={() => {this.state.increment()}}>click here</button>*/}
//         	<ImageGallery disabled={false} images={images} />
//         </div>
//     );
// };

// export default MyBoardPage;



import React, { Component, useState, useEffect } from 'react';

import { auth, firestore } from '../../firebase/firebase-utils';

import './myboardpage.scss';

import ImageGallery from '../../components/image-gallery/image-gallery';

class MyBoardPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	images: [],
        	count: 0
        };
    }

    componentDidMount() {
    	this.getImages();
    }


    getImages = (count=5) => { 	
    	const userDocRef = firestore.collection(`users/${auth.currentUser.uid}/posts`);

	    var userImages = userDocRef
	    				.orderBy('createdAt')
	    				.limit(count)
	    				.get()
	    				.then((snapShot) => {
	    					snapShot.forEach((doc) => {
	    						var data = doc.data();
	    						var src = data.mediaURL;
	    						var height = data.height;
	    						var width = data.width;
	    						var newImage = { src: src, height: height, width: width };
	    						this.setState({
	    							images: [...this.state.images, newImage],
	    						});
	    						// setImages([...images, newImage]);
	    						console.log(this.state.images);
	    					});
	    				})
	    				.catch((err) => {
	    					console.log(err);
	    				});
	    				console.log('getImages ran --myboardpage: 107');
	    return;
    };

    render() {
        return (
            <div className='myboardpage'>
	        	{/*<h3>{count}</h3>
	        	        	<button onClick={() => {this.state.increment()}}>click here</button>*/}
	        	<ImageGallery disabled={false} images={this.state.images} />
        	</div>
        );
    }
}

export default MyBoardPage;
