import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as Icon } from '../../assets/plus.svg';
import UploadModal from '../upload-modal/upload-modal';

import './upload-icon.scss';

const UploadIcon = () => {
    return (
        <div className='upload-icon'>
        	<Icon className='icon' onClick={ () => {
        		document.getElementById('my-board-link').click();
        		document.getElementById('modal-button').click();
        	} } />
        	<UploadModal id='upload-button' className='upload-modal'/>
        	<Link className='hidden-input' to='/myboard' id='my-board-link'/>
        </div>
    );
};

export default UploadIcon;
