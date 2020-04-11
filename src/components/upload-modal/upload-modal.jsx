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
            instructionsVis: 'instructions',
        	imageRef: '',
        	height: 0,
        	width: 0,
        	value: '',
            isLoading: false,
            isUploading: false,
        }
    }


    handleUploadPreview = (event) => {
    	event.preventDefault();

        this.setState({
            isLoading: true
        });

    	var reader = new FileReader();
    	var file = event.target.files[0];

    	reader.onloadend = () => {
    		this.setState({
    			file: file,
    			filePreview: reader.result,
    			fileName: file.name,
    			imageRef: storageRef.child(`${auth.currentUser.uid}/${file.name}`),
                buttonVis: 'button-fade',
                instructionsVis: 'instructions-hide',
                isLoading: false,
    		});
    	}
    	reader.readAsDataURL(file);

    };

    handleSize = (event) => {
    	event.preventDefault();
    	var value = event.target.value;
    	console.log(value);

    	switch (event.target.value) {
    		case '0':
    			this.setState({
    				height: 4,
    				width: 3
    			});
    			console.log('tall');
    			break;
    		case '1':
    			this.setState({
    				height: 1,
    				width: 1
    			});
    			console.log('square');
    			break;
    		case '2':
    			this.setState({
    				height: 3,
    				width: 4
    			});
    			console.log('wide');
    			break;
    		case '3':
    			this.setState({
    				height: 1,
    				width: 5
    			});
    			console.log('panorama');
    			break;
    		default:
	    		this.setState({
	    				height: 0,
	    				width: 0
	    			});
    			console.log('nothing');
    			break;
    	}
    };


    render() {


        return (
            <Popup className='pop-up' trigger={<button className="open-button" id='modal-button'></button>} modal>
			    {close => (
			      <div className="modal">
			        <a className="close" 
                        onClick={close}
                        href='#'>
			          &#10799;
			        </a>
			        <div className='modal-header'>
			        	<h3>New Post</h3>
			        	<div className='select-wrapper'>
			        		<select className='option-select' placeholder='Size' onChange={this.handleSize}>
			        			<option value='' disabled selected default hidden>Choose a size ↓</option>
			        			<option value='0'>Tall</option>
			        			<option value='1'>Square</option>
			        			<option value='2'>Wide</option>
			        			<option value='3'>Panorama</option>
			        		</select>
			        	</div>
			        </div>
			        <div className="content-wrapper">
				        <div className="content">
				          <input type='file' 
				          		 id='upload-input' 
				          		 className='hidden-input' 
				          		 accept='video/*,image/*' 
				          		 onInput={this.handleUploadPreview} 
				          		 required />
				         <Icon className={this.state.buttonVis} 
                                width='1em' 
                                height='1em' 
                                onClick={() => {
                                    document.getElementById('upload-input').click();
                                    
                                }}/>
                          {this.state.isLoading ? <span>LOADING...</span> :
				          <img src={this.state.filePreview} alt='' className='image-preview'/>
                          }
                          <span className={this.state.instructionsVis}>Upload a video/image</span>
				        </div>
				        <div className='content-text-wrapper'>
				        	<textarea className='content-text' id='post-description' type='text' placeholder='Write a description...' required />
				        </div>
			        </div>
			        <div className="actions">
			          <CustomButton
            			onClick={() => {
            				if((this.state.file !== '')&&(this.state.width !== 0)&&(this.state.height !== 0)) {
                                this.setState({
                                    isUploading: true
                                });
            					uploadUserMedia(this.state.file, 
            									document.getElementById('post-description').value, 
            									this.state.fileName, 
            									this.state.height, 
            									this.state.width)
                                                .then(event => {
                                                    this.setState({
                                                        isUploading: false
                                                    });
                                                    // setTimeout(() => {
                                                    //     console.log('timeout');
                                                    // }, 3000);
                                                    close();
                                                });
            					this.setState({
					              	file: '',
					              	filePreview: '',
					              	fileName: '',
					              	buttonVis: 'upload-icon',
                                    instructionsVis: 'instructions',
					              	imageRef: '',
					              	height: 0,
					              	width: 0
					              });
            				} else {
            					alert('Please upload a media file and/or select a size.');
            					return;
            				}
            				// console.log('posted');
            				// close();
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
                            instructionsVis: 'instructions',
			              	imageRef: '',
			              	height: 0,
					        width: 0
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
