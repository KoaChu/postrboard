import React from 'react';

import { ReactComponent as Icon } from '../../assets/upload.svg';

import './upload-icon.scss';

const UploadIcon = () => {
    return (
        <div className='upload-icon'>
        	<Icon className='icon' />
        </div>
    );
};

export default UploadIcon;
