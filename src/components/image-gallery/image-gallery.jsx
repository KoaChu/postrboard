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
		console.log("USE EFFECT CALLED" + JSON.stringify(items));
	},[images]);

	// useCallback(() => {
	// 	setItems(images);
	// },[items]);

    const onSortEnd = ({ oldIndex, newIndex }) => {
      setItems(arrayMove(items, oldIndex, newIndex));
      console.log(newIndex);
    };

    return (
        <div className='image-gallery'>
        	<SortableGallery items={items} onSortEnd={onSortEnd} axis={"xy"} />
        </div>
    );
};

export default ImageGallery;




// class ImageGallery extends React.Component {

//     constructor(props) {
//         super(props);

//         this.state = {
//         	items: photos
//         }
//     }

//     // onSortEnd = ({oldIndex, newIndex}) => {
//     //   this.setState({items:arrayMove(items, oldIndex, newIndex)});
//     // };

//     render() {
//     	const SortablePhoto = SortableElement(item => <Photo {...item} />);
// 		const SortableGallery = SortableContainer(({ items }) => (
// 	 	 <Gallery photos={items} renderImage={props => <SortablePhoto {...props} margin={2} disabled={this.props.disabled} />} />
// 			));
//         return (
//             <div className='image-gallery'>
//             	<h3>{this.props.images ? this.props.images[0].src : 'NULL'}</h3>
//         		<SortableGallery items={this.state.items} onSortEnd={this.onSortEnd} axis={"xy"} />
//         	</div>
//         );
//     }
// }

// export default ImageGallery;
