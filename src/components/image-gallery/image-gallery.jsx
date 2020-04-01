import React, { useState } from "react";
import Gallery from "react-photo-gallery";
import Photo from "./photo";
import arrayMove from "array-move";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { photos } from "./photos";
import './image-gallery.scss';


const ImageGallery = ({ disabled, images }) => {

	const SortablePhoto = SortableElement(item => <Photo {...item} />);
	const SortableGallery = SortableContainer(({ items }) => (
	  <Gallery photos={items} renderImage={props => <SortablePhoto {...props} margin={2} disabled={disabled} />} />
	));

	const [items, setItems] = useState(photos);

    const onSortEnd = ({ oldIndex, newIndex }) => {
      setItems(arrayMove(items, oldIndex, newIndex));
    };

    return (
        <div className='image-gallery'>
        	<h3>{images[0]}</h3>
        	<SortableGallery items={items} onSortEnd={onSortEnd} axis={"xy"} />
        </div>
    );
};

export default ImageGallery;
