import React, {  Component } from 'react';
import Popup from 'reactjs-popup';
import { connect } from 'react-redux';

import { ReactComponent as Icon } from '../../assets/uploadv2.svg';

import CustomButton from '../custom-button/custom-button';

import { uploadUserMedia, setUserPosts, storageRef, auth } from '../../firebase/firebase-utils';

import './upload-modal.scss';


class UploadModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	mediaUrl: 'none',
        	filePreview: '',
        	file: '',
        	fileName: '',
        	buttonVis: 'upload-icon',
        	imageRef: ''
        }
    }

    handleUploadPreview = (event) => {
    	event.preventDefault();

    	var reader = new FileReader();
    	var file = event.target.files[0];

    	reader.onloadend = () => {
    		this.setState({
    			file: file,
    			filePreview: reader.result,
    			fileName: file.name,
    			imageRef: storageRef.child(`${auth.currentUser.uid}/${file.name}`)
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
				          		 onInput={this.handleUploadPreview} 
				          		 required />
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
				        	<textarea className='content-text' id='post-description' type='text' placeholder='Write a description...' required />
				        </div>
			        </div>
			        <div className="actions">
			          <CustomButton
            			onClick={() => {
            				if(this.state.file !== '') {
            					uploadUserMedia(this.state.file);
            					this.state.imageRef.getDownloadURL()
            								.then( (url) => {
            									console.log(url);
            									this.setState({
            										mediaUrl: url,
            									});
            									console.log(this.state.mediaUrl);
            								});
            				}
            				setUserPosts(this.state.mediaUrl, document.getElementById('post-description').value, this.state.fileName);
            				console.log('posted');
            				close();
            			}}
            			> Post 
			          </CustomButton>
			          <CustomButton
			          	className='cancel-button'
			            onClick={() => {
			              this.setState({
			              	file: '',
			              	filePreview: '',
			              	fileName: '',
			              	buttonVis: 'upload-icon',
			              	imageRef: ''
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
	uploadUserMedia: () => dispatch(uploadUserMedia()),
	setUserPosts: () => dispatch(setUserPosts())
});

export default connect(null, mapDispatchToProps)(UploadModal);
