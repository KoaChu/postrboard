import React, { useState } from 'react';
import Popup from 'reactjs-popup';

import { ReactComponent as NotesIcon } from '../../assets/black-notes.svg'

import './comment-modal.scss';

const CommentModal = ({ className }) => {

    return (
        <div className='comment-modal'>
        	<a class="comment-close" href='#'>&times;</a>
        	<div className='comment-image'>
        		<img src='' alt='post-image' />
        	</div>
        	<div className='comment-area'>
        		<span className='comment-header'>Notes</span>
        		<div className='comments'></div>
        	</div>
        </div>
    );
};


export default CommentModal;
