import React from 'react';

import './homepage.scss';

import ImageGallery from '../../components/image-gallery/image-gallery';


const HomePage = () => (
<div className='homepage'>
	<ImageGallery disabled={true} />
</div>
	);

export default HomePage;