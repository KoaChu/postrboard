import React, { useState, useEffect, useCallback } from "react";
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

	// console.log(Date.now() + " Uploaded Images: " + JSON.stringify(images));
	// console.log(Date.now() + " phpress: " + JSON.stringify(photos));

	const [items, setItems] = useState(images);

	useEffect(() => {
		setItems(images);
		// console.log("USE EFFECT CALLED" + JSON.stringify(items));
	},[images]);

    const onSortEnd = ({ oldIndex, newIndex }) => {
      setItems(arrayMove(items, oldIndex, newIndex));
      if(newIndex===oldIndex) {
      	for(let i=0; i<3; i++) {
      		console.log('PIC: ' + items[i].src + '\n' + 'DB Index: ' + items[i].index + '\n' + 'IG Index: ' + items[i].oldIndex);
      	}
      	return;
      }
      console.log('old index: ' + oldIndex + items[oldIndex].src);
      console.log('new index: ' + newIndex + items[newIndex].src);
    };

    return (
        <div className='image-gallery'>
        	<SortableGallery items={items} onSortEnd={onSortEnd} axis={"xy"} />
        </div>
    );
};

export default ImageGallery;

