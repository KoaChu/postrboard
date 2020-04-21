import React, { useState } from "react";
import { firestore, auth, onDeleteIndexes, storageRef } from '../../firebase/firebase-utils';

import LoadingIndicator from '../loading-indicator/loading-indicator';
import CommentModal from '../comment-modal/comment-modal';

import { ReactComponent as Trash } from '../../assets/trash.svg';
import { ReactComponent as PreLike } from '../../assets/pre-like.svg';
import { ReactComponent as Like } from '../../assets/like.svg';
import { ReactComponent as Notes } from '../../assets/notes.svg';

import './photo.scss';

const imgWithClick = { cursor: "pointer" };

const Photo = ({ index, onClick, photo, margin, direction, top, left }) => {

  const localUser = JSON.parse(localStorage.getItem('currentUser'));  
  const localUid = localUser.id;

  const [imgText, setImgText] = useState('');
  const [imguid, setImgUid] = useState('');
  const [trashHovered, setTrashHovered] = useState('');
  const [notesHovered, setNotesHovered] = useState('');
  const [imgName, setImgName] = useState('');
  const [imgIndex, setImgIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  // const [liked, setLiked] = useState(false);
  const [permLike, setPermLike] = useState(false);
  const [showComments, setShowComments] = useState('');

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

  const onMouseOver = async (event) => {
    // console.log(event.target.parentElement.parentElement.firstElementChild.getAttribute('name'));

    setImgText(event.target.parentElement.parentElement.firstElementChild.getAttribute('text'));
    setImgUid(event.target.parentElement.parentElement.firstElementChild.getAttribute('imguid'));
    setImgIndex(event.target.parentElement.parentElement.firstElementChild.getAttribute('index'));
    setImgName(event.target.parentElement.parentElement.firstElementChild.getAttribute('name'));

    const userLikesRef = firestore.collection(`users/${auth.currentUser.uid}/likes`);
    const imgRef = await event.target.parentElement.parentElement.firstElementChild.getAttribute('name');
    
    userLikesRef.get()
                .then((snap) => {
                  // console.log(imgRef);
                  if(snap.size===0) {
                    return;
                  } else {
                    const userLikes = snap.docs.map(like => (
                      like.id
                    ));
                    // console.log(userLikes + ' includes ' + imgRef);
                    if(userLikes.includes(imgRef)) {
                      setPermLike(true);
                    } else {
                      return;
                    }
                    // console.log(userLikes);
                  }
                })
                .catch((err) =>{
                  console.log(err.message);
                });
  };

  // const onMouseLeave = event => {
  //   setImgUid('');
  // };

  const onTrashMouseOver = event => {
    setTrashHovered('trash-like-hovered');
  };

  const onTrashMouseOut = event => {
    setTrashHovered('');
  };

  const onLikeMouseOver = event => {
    setTrashHovered('trash-like-hovered');
    // setLiked(true);
  };

  const onLikeMouseOut = event => {
    setTrashHovered('');
    // setLiked(false);
  };

  const onNotesMouseOver = event => {
    setNotesHovered('notes-hovered');
  };

  const onNotesMouseOut = event => {
    setNotesHovered('');
  };

  const onNotesClick = event => {
    setShowComments('comments-visible');
    console.log('notes-clicked');
  };

  const handleLike = event => {
    const userLikeRef = firestore.doc(`users/${auth.currentUser.uid}/likes/${imgName}`);
    const imgRef = event.target.parentElement.parentElement.firstChild.nextSibling.getAttribute('name');

    if(permLike) {
      // console.log(imgRef);
      firestore.doc(`users/${auth.currentUser.uid}/likes/${ imgRef }`)
                .delete()
                .then(() => {
                  // console.log('deleted');
                })
                .catch((err) => {
                  console.log(err);
                });
    } else {
      userLikeRef.set({
        createdAt: new Date(),
      })
    }
    setPermLike(!permLike);
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
      {permLike ? 
        <span className={`${trashHovered} trash-like`}>
          <Like className='trash-like' />
        </span>
        : null
      }
      {isDeleting ? <LoadingIndicator id='deleting-indicator' loadingText='Removing' /> :
      <img
        style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
        {...photo}
        // onClick={onClick ? handleClick : null}
        alt="img"
        id='inside-img'
      />}
      <span className={`${notesHovered} notes`}
            onMouseOver={onNotesMouseOver}
            onMouseOut={onNotesMouseOut}
            onClick={onNotesClick}
            >
        <Notes className={`${notesHovered} inner-notes`} />
      </span>
      {imguid === localUid ? 
        <span onMouseOver={onTrashMouseOver} 
              onMouseOut={onTrashMouseOut} 
              onClick={handleDelete}
              className={`${trashHovered} trash-like`}>
              <Trash className={`${trashHovered} trash-like`}/>
        </span> 
        : 
        <span onMouseOver={onLikeMouseOver} 
              onMouseOut={onLikeMouseOut} 
              onClick={handleLike}
              className={`${trashHovered} trash-like`}>
              <PreLike className='trash-like' />
        </span>}
      <div onMouseEnter={onMouseOver} className='overlay'>
        <div className='overlay-text'>
          <span>{imgText}</span>
        </div>
      </div>
      <span className={`${showComments} cm`}>
        <CommentModal className={`${showComments} comment-modal`}/>
      </span>
      <a href='/myboard' id='hidden-refresh'>''</a>
    </div>
  );
};

export default Photo;