import React, { useState } from "react";
import { render } from "react-dom";
import Gallery from "react-photo-gallery";
import Photo from "./photo";
import arrayMove from "array-move";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { photos } from "./photos";
import './image-gallery.scss';


const ImageGallery = () => {

	const SortablePhoto = SortableElement(item => <Photo {...item} />);
	const SortableGallery = SortableContainer(({ items }) => (
	  <Gallery photos={items} renderImage={props => <SortablePhoto {...props} margin={2}/>} />
	));

	const [items, setItems] = useState(photos);

    const onSortEnd = ({ oldIndex, newIndex }) => {
      setItems(arrayMove(items, oldIndex, newIndex));
    };

    return (
        <div className='image-gallery'>
        	<SortableGallery items={items} onSortEnd={onSortEnd} axis={"xy"} />
        </div>
    );
};

export default ImageGallery;
