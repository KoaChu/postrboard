import React from 'react';

import './homepage.scss';

import ImageGallery from '../../components/image-gallery/image-gallery';

import { photos } from "../../components/image-gallery/photos";


const HomePage = () => (
<div className='homepage'>
	<ImageGallery disabled={true} images={photos} />
</div>
	);

export default HomePage;