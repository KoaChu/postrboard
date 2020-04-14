import React, { useState } from "react";

import { firestore } from '../../firebase/firebase-utils';

import { ReactComponent as Trash } from '../../assets/trash.svg';

import './photo.scss';

const imgWithClick = { cursor: "pointer" };

const Photo = ({ index, onClick, photo, margin, direction, top, left }) => {

  const localUser = JSON.parse(localStorage.getItem('currentUser'));  
  const localUid = localUser.id;
  const userDocRef = firestore.collection(`users/${localUid}/posts`);

  const [imgText, setImgText] = useState('');
  const [imgUid, setImgUid] = useState('');
  const [trashHovered, setTrashHovered] = useState('');

  const imgStyle = { margin: margin };
  if (direction === "column") {
    imgStyle.position = "absolute";
    imgStyle.left = left;
    imgStyle.top = top;
  }

  const handleClick = event => {
    onClick(event, { photo, index });
    console.log(index);
  };

  const onMouseOver = event => {
    // console.log(event.target.parentElement.parentElement.firstElementChild.getAttribute('uid'));
    setImgText(event.target.parentElement.parentElement.firstElementChild.getAttribute('text'));
    setImgUid(event.target.parentElement.parentElement.firstElementChild.getAttribute('uid'));
  };

  const onMouseLeave = event => {
    setImgUid('');
  };

  const onTrashLikeMouseOver = event => {
    setTrashHovered('trash-like-hovered');
  };

  const onTrashLikeMouseOut = event => {
    setTrashHovered('');
  };


  return (
    <div className='container'>
      <img
        style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
        {...photo}
        // onClick={onClick ? handleClick : null}
        alt="img"
        id='inside-img'
      />
      {imgUid === localUid ? 
        <span onMouseOver={onTrashLikeMouseOver} 
              onMouseOut={onTrashLikeMouseOut} 
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
    </div>
  );
};

export default Photo;