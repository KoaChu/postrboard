import React, { useState, useEffect, useCallback } from "react";
import Gallery from "react-photo-gallery";
import Photo from "./photo";
import arrayMove from "array-move";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

import { updatePushDown, updatePushUp } from '../../firebase/firebase-utils';

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

      var newDBIndex = (items.length-1) - newIndex;
      var oldDBIndex = (items.length-1) - oldIndex;

      if(newIndex===oldIndex) {
      	return;
      } else if(newIndex < oldIndex) {
        //need to push all indexes < AND = NEW DB INDEX DOWN and keep any with an index < old DB index
        updatePushDown(oldDBIndex, newDBIndex);

      	// console.log('new db index: ' + newDBIndex + '\n' + 'starting db index: ' + oldDBIndex);
      	return;
      }	else if(newIndex > oldIndex) {
        //need to push all indexes > AND = NEW DB INDEX UP and keep any with an index > old DB index
        updatePushUp(oldDBIndex, newDBIndex);
        
      	// console.log('new db index: ' + newDBIndex + '\n' + 'starting db index: ' + oldDBIndex);
   		return;
      } else {
      	return;
      }
    };

    return (
        <div className='image-gallery'>
        	<SortableGallery items={items} disableAutoscroll={true} onSortEnd={onSortEnd} axis={"xy"} />
        </div>
    );
};

export default ImageGallery;

