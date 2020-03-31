import React, { useState } from 'react';
import { auth, firestore } from '../../firebase/firebase-utils';

import './myboardpage.scss';

import ImageGallery from '../../components/image-gallery/image-gallery';

const MyBoardPage = () => {
	const [images, setImages] = useState([]);

    const userDocRef = firestore.collection(`users/${auth.currentUser.uid}/posts`);

    const getImages = () => { 	
	    var userImages = userDocRef
	    				.orderBy('createdAt')
	    				.limit(2)
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

    return (
        <div className='myboardpage'>
        	<ImageGallery disabled={false} images={images} />
        </div>
    );
};

export default MyBoardPage;
