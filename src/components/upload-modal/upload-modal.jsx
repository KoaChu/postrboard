import React, {  Component } from 'react';
import Popup from 'reactjs-popup';
import { connect } from 'react-redux';

import { ReactComponent as Icon } from '../../assets/uploadv2.svg';

import CustomButton from '../custom-button/custom-button';

import { uploadUserMedia } from '../../firebase/firebase-utils';

import './upload-modal.scss';


class UploadModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	mediaUrl: '',
        	filePreview: '',
        	file: '',
        	buttonVis: 'upload-icon',
        }
    }

    handleUploadPreview = (event) => {
    	event.preventDefault();

    	var reader = new FileReader();
    	var file = event.target.files[0];

    	reader.onloadend = () => {
    		this.setState({
    			file: file,
    			filePreview: reader.result
    		});
    	}
    	reader.readAsDataURL(file);
    };

    render() {
        return (
            <Popup className='pop-up' trigger={<button className="open-button" id='modal-button'></button>} modal>
			    {close => (
			      <div className="modal">
			        <a className="close" onClick={close} href='/myboard'>
			          &times;
			        </a>
			        <div className='modal-header'>
			        	<h3>New Post</h3>
			        </div>
			        <div className="content-wrapper">
				        <div className="content">
				          <input type='file' 
				          		 id='upload-input' 
				          		 className='hidden-input' 
				          		 accept='video/*,image/*' 
				          		 onInput={this.handleUploadPreview} />
				         <Popup trigger={<Icon className={this.state.buttonVis} 
								          		width='1em' 
								          		height='1em' 
								          		onClick={() => {
								          			document.getElementById('upload-input').click();
								          			this.setState({
								          				buttonVis: 'button-fade'
								          			});
								          		}}/>}
								  position='top center'
								  on='hover'
								  className='upload-popup'>
					      	Upload an image or video
				          </Popup>
				          <img src={this.state.filePreview} alt='' className='image-preview'/>
				        </div>
				        <div className='content-text-wrapper'>
				        	<textarea className='content-text' type='text' placeholder='Write a description...' />
				        </div>
			        </div>
			        <div className="actions">
			          <Popup
			            trigger={<CustomButton> Post </CustomButton>}
			            position="top center"
			            closeOnDocumentClick
			          >
			            <span>
			              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
			              magni omnis delectus nemo, maxime molestiae dolorem numquam
			              mollitia, voluptate ea, accusamus excepturi deleniti ratione
			              sapiente! Laudantium, aperiam doloribus. Odit, aut.
			            </span>
			          </Popup>
			          <CustomButton
			          	className='cancel-button'
			            onClick={() => {
			              this.setState({
			              	filePreview: ''
			              });
			              close();
			            }}
			          >
			            Cancel
			          </CustomButton>
			        </div>
			      </div>
			    )}
			</Popup>
        );
    }
}

const mapDispatchToProps = dispatch => ({
	uploadUserMedia: () => dispatch(uploadUserMedia())
});

export default connect(null, mapDispatchToProps)(UploadModal);
