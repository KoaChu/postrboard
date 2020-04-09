import React, { useState } from "react";

import './photo.scss';

const imgWithClick = { cursor: "pointer" };

const Photo = ({ index, onClick, photo, margin, direction, top, left }) => {

  const [imgText, setImgText] = useState('');

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
    // console.log(event.target);
    setImgText(event.target.parentElement.parentElement.firstElementChild.getAttribute('text'));
  }


  return (
    <div className='container'>
      <img
        style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
        {...photo}
        // onClick={onClick ? handleClick : null}
        alt="img"
        id='inside-img'
      />
      <div onMouseOver={onMouseOver} className='overlay'>
        <div className='overlay-text'>{imgText}</div>
      </div>
    </div>
  );
};

export default Photo;