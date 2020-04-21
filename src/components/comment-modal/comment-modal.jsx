import React, { useState } from 'react';
import Popup from 'reactjs-popup';

import CustomButton from '../custom-button/custom-button';

import { ReactComponent as NotesIcon } from '../../assets/black-notes.svg'

import './comment-modal.scss';

const CommentModal = ({ imgSrc }) => {

    return (
    	<div className='notes-modal'>
	        <div className='comment-modal'>
	        </div>
        	<a class="comment-close" href='#'>&times;</a>
        	<div className='comment-image'>
        		<img src={imgSrc} alt='post-image' className='notes-image'/>
        	</div>
        	<div className='comment-area'>
        		<span className='comment-header'>@posterUserName</span>
        		<div className='comments'>

        		</div>
        		<div className='note-input'>
    				<textarea className='note-text' id='note-text' rows={1} type='text' placeholder='Post a note...' onChange={() => {console.log('hi');}} required />
        		</div>
        		<CustomButton id='note-button'>Post</CustomButton>
        	</div>
        </div>
    );
};


export default CommentModal;
