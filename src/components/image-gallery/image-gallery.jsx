import React, { useState, useEffect, useMemo } from "react";
import Gallery from "react-photo-gallery";
import Photo from "../photo/photo";
import arrayMove from "array-move";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

import { updatePushDown, updatePushUp } from '../../firebase/firebase-utils';

import './image-gallery.scss';


const ImageGallery = ({ disabled, images, postCount }) => {

	const SortablePhoto = SortableElement(item => <Photo {...item} />);
	const SortableGallery = SortableContainer(({ items }) => (
	  <Gallery photos={items} renderImage={props => <SortablePhoto {...props} margin={2} disabled={disabled} />} />
	));

	// console.log(Date.now() + " Uploaded Images: " + JSON.stringify(images));
	// console.log(Date.now() + " phpress: " + JSON.stringify(photos));

	const [items, setItems] = useState(images);
  const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setItems(images);
    setIsLoading(false);
		// console.log("USE EFFECT CALLED" + JSON.stringify(items));
	},[images]);


    const onSortEnd = ({ oldIndex, newIndex }) => {
      setItems(arrayMove(items, oldIndex, newIndex));

      var newDBIndex = postCount - newIndex;
      var oldDBIndex = postCount - oldIndex;
      // console.log(postCount + 'items length: ' + items.length);

      if(newIndex===oldIndex) {
      	return;
      } else if(newIndex < oldIndex) {
        //need to push all indexes < AND = NEW DB INDEX DOWN and keep any with an index < old DB index
        setIsLoading(true);
        updatePushDown(oldDBIndex, newDBIndex).then(event => {setIsLoading(false);});
      	return;
      }	else if(newIndex > oldIndex) {
        //need to push all indexes > AND = NEW DB INDEX UP and keep any with an index > old DB index
        setIsLoading(true);
        updatePushUp(oldDBIndex, newDBIndex).then(event => {setIsLoading(false);});
   		return;
      } else {
      	return;
      }
    };

    return (
        <div className='image-gallery'>
          {isLoading ? <div>LOADING...</div> :
        	<SortableGallery items={items} disableAutoscroll={true} pressDelay={500} onSortEnd={onSortEnd} axis={"xy"} />
          }
        </div>
    );
};

export default ImageGallery;

