import React, { useState } from "react";

import { firestore, auth, onDeleteIndexes, storageRef } from '../../firebase/firebase-utils';

import { ReactComponent as Trash } from '../../assets/trash.svg';

import './photo.scss';

const imgWithClick = { cursor: "pointer" };

const Photo = ({ index, onClick, photo, margin, direction, top, left }) => {

  const localUser = JSON.parse(localStorage.getItem('currentUser'));  
  const localUid = localUser.id;

  const [imgText, setImgText] = useState('');
  const [imgUid, setImgUid] = useState('');
  const [trashHovered, setTrashHovered] = useState('');
  const [imgName, setImgName] = useState('');
  const [imgIndex, setImgIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const imgStyle = { margin: margin };
  if (direction === "column") {
    imgStyle.position = "absolute";
    imgStyle.left = left;
    imgStyle.top = top;
  }

  // const handleClick = event => {
  //   onClick(event, { photo, index });
  //   // console.log(index);
  // };

  const onMouseOver = event => {
    // console.log(event.target.parentElement.parentElement.firstElementChild.getAttribute('uid'));
    setImgText(event.target.parentElement.parentElement.firstElementChild.getAttribute('text'));
    setImgUid(event.target.parentElement.parentElement.firstElementChild.getAttribute('uid'));
    setImgIndex(event.target.parentElement.parentElement.firstElementChild.getAttribute('index'));
    setImgName(event.target.parentElement.parentElement.firstElementChild.getAttribute('name'));
  };

  // const onMouseLeave = event => {
  //   setImgUid('');
  // };

  const onTrashLikeMouseOver = event => {
    setTrashHovered('trash-like-hovered');
  };

  const onTrashLikeMouseOut = event => {
    setTrashHovered('');
  };

  const handleDelete = (event) => {
    var result = window.confirm('Are you sure?');

    if(result === true){
      setIsDeleting(true);
      var docRef = firestore.doc(`users/${auth.currentUser.uid}/posts/${ imgName }`);
      var mediaDeleteRef = storageRef.child(`${auth.currentUser.uid}/${ imgName }`);

      docRef.delete()
            .then(() => {
              onDeleteIndexes(parseInt(imgIndex));
              mediaDeleteRef.delete()
                            .then(() => {
                              console.log('file deleted successfully');
                              setIsDeleting(false);
                              setTimeout(() => {
                                document.getElementById('hidden-refresh').click();
                              }, 1000);
                            })
                            .catch((err) =>{
                              console.log(err.message);
                              setIsDeleting(false);
                              alert('Could not delete file.');
                            });
            });

      // console.log(imgName);
      // console.log(imgIndex);
      // console.log(event.target.parentElement.parentElement.firstElementChild);
    } else {
      return;
    }

  };


  return (
    <div className='container'>
      {isDeleting ? <div>deleting...</div> :
      <img
        style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
        {...photo}
        // onClick={onClick ? handleClick : null}
        alt="img"
        id='inside-img'
      />}
      {imgUid === localUid ? 
        <span onMouseOver={onTrashLikeMouseOver} 
              onMouseOut={onTrashLikeMouseOut} 
              onClick={handleDelete}
              className={`${trashHovered} trash-like`}>
              <Trash className={`${trashHovered} trash-like`}/>
        </span> 
        : 
        <span onMouseOver={onTrashLikeMouseOver} 
              onMouseOut={onTrashLikeMouseOut} 
              className={`${trashHovered} trash-like`}>
              like
        </span>}
      <div onMouseEnter={onMouseOver} className='overlay'>
        <div className='overlay-text'>
          <span>{imgText}</span>
        </div>
      </div>
      <a href='/myboard' id='hidden-refresh'>''</a>
    </div>
  );
};

export default Photo;