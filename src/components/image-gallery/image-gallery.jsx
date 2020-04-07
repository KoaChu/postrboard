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

	const onSortStart = ({index}) => {
		console.log('clicked-index: ' + index);
	};

    const onSortEnd = ({ oldIndex, newIndex }) => {
      setItems(arrayMove(items, oldIndex, newIndex));

      var newDBIndex = (items.length-1) - newIndex;
      var oldDBIndex = (items.length-1) - oldIndex;

      if(newIndex===oldIndex) {
      	for(let i=0; i<items.length; i++) {
      		console.log('PIC: ' + items[i].src + '\n' + 'DB Index: ' + items[i].index + '\n' + 'IG Index: ' + oldIndex);
      	}
      	return;
      } else if(newIndex < oldIndex) {
        //need to push all indexes LOWER THAN NEW DB INDEX DOWN and keep any with an index < old DB index
      	console.log('new db index: ' + newDBIndex + '\n' + 'starting db index: ' + oldDBIndex);
      	return;
      }	else if(newIndex > oldIndex) {
        //need to push all indexes HIGHER THAN NEW DB INDEX UP and keep any with an index > old DB index
      	console.log('new db index: ' + newDBIndex + '\n' + 'starting db index: ' + oldDBIndex);
   		return;
      } else {
      	return;
      }
      // var temp_names = items.map(i => "Item " + i.index);
      // console.log('old index: ' + oldIndex + " - " + temp_names[oldIndex]);
      // console.log('new index: ' + newIndex + " - " + temp_names[newIndex]);
    };

    return (
        <div className='image-gallery'>
        	<SortableGallery items={items} disableAutoscroll={true} onSortEnd={onSortEnd} onSortStart={onSortStart} axis={"xy"} />
        </div>
    );
};

export default ImageGallery;

