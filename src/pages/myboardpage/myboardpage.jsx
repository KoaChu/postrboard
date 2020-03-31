import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../firebase/firebase-utils';

import './myboardpage.scss';

import ImageGallery from '../../components/image-gallery/image-gallery';

const MyBoardPage = () => {
	const [images, setImages] = useState([]);
	const [count, setCount] = useState(0);

    const userDocRef = firestore.collection(`users/${auth.currentUser.uid}/posts`);

    const getImages = (count=5) => { 	
	    var userImages = userDocRef
	    				.orderBy('createdAt')
	    				.limit(count)
	    				.get()
	    				.then((snapShot) => {
	    					snapShot.forEach((doc) => {
	    						var data = doc.data();
	    						var imageUrl = data.mediaURL;
	    						setImages([...images, imageUrl]);
	    						console.log(imageUrl);
	    					});
	    				})
	    				.catch((err) => {
	    					console.log(err);
	    				});
	    return;
    };
    
    React.useEffect(() => {
    	getImages();
    }, []);

    return (
        <div className='myboardpage'>
        	<h3>{count}</h3>
        	<button onClick={() => {
        		setCount(count + 1);
        	}}>click here</button>
        	<ImageGallery disabled={false} images={images} />
        </div>
    );
};

export default MyBoardPage;
