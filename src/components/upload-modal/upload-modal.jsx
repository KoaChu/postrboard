import React, {  Component } from 'react';
import Popup from 'reactjs-popup';
import { connect } from 'react-redux';

import { ReactComponent as Icon } from '../../assets/uploadv2.svg';

import CustomButton from '../custom-button/custom-button';
import LoadingIndicator from '../loading-indicator/loading-indicator';
import ProgressBar from '../progress-bar/progress-bar';

import { storageRef, auth, firestore, firebaseStorage } from '../../firebase/firebase-utils';

import './upload-modal.scss';


class UploadModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	mediaUrl: 'none',
        	filePreview: '',
        	file: '',
        	fileName: '',
            postText: '',
        	buttonVis: 'upload-icon',
            instructionsVis: 'instructions',
        	imageRef: '',
        	height: 0,
        	width: 0,
        	value: '',
            isLoading: false,
            buttonSelectable: '',
            posting: 'Post',
            progress: 0,
        }
    }

    handleTextChange = (event) => {
        this.setState({
            postText: event.target.value
        });
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
                isUploading: false,
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
            <div className='modal-wrapper'>
            <a className='hidden-refresh' id='hidden-refresh' href='/myboard'></a>
            <Popup className='pop-up' trigger={<button className="open-button" id='modal-button'></button>} modal>
			    {close => (
			      <div className="modal">
			        <a className="close" 
                        onClick={close}
                        href='#'>
			          &#10799;
			        </a>
			        {this.state.isUploading 
                    ?  <div className='loading-spinner'>
                            <LoadingIndicator className='spinner' loadingText='Uploading' />
                            <ProgressBar className='upload-progress' progress={this.state.progress} />
                        </div>
                    :  <div className='modal'><div className='modal-header'>
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
                              {this.state.isLoading ? <span className='loading-indicator'>Loading...</span> :
    				          <img src={this.state.filePreview} alt='' className='image-preview'/>
                              }
                              <span className={this.state.instructionsVis}>Upload a video/image</span>
    				        </div>
    				        <div className='content-text-wrapper'>
    				        	<textarea className='content-text' id='post-description' type='text' placeholder='Write a description...' onChange={this.handleTextChange} required />
    				        </div>
    			        </div>
                        </div>}
			        <div className="actions">
			          <CustomButton
                        id={this.state.buttonSelectable}
            			onClick={async () => {
            				if((this.state.file !== '')&&(this.state.width !== 0)&&(this.state.height !== 0)) {
                                this.setState({
                                    isUploading: true,
                                    buttonSelectable: 'unselect',
                                    posting: 'Posting',
                                });

                                let thisComponent = this;

                                var fileName = this.state.fileName;
                                var height = this.state.height;
                                var width = this.state.width;
                                var text = this.state.postText;

                                var index = -1;

                                var mediaUploadTask = storageRef.child(`${auth.currentUser.uid}/${this.state.fileName}`).put(this.state.file);

                                const userDocRef = firestore.collection(`users/${auth.currentUser.uid}/posts`);
                                const userPostsRef = firestore.doc(`users/${auth.currentUser.uid}/posts/${this.state.fileName}`);

                                const createdAt = new Date();

                                await userDocRef.orderBy('index', 'desc')
                                                .limit(1)
                                                .get()
                                                .then((snapShot) => {
                                                    try{
                                                          if(snapShot.size===0) {
                                                            index = 0;
                                                            // console.log('first index set success');
                                                          } else {
                                                              snapShot.forEach((doc) => {
                                                              var data = doc.data();
                                                              index = (data.index + 1);
                                                              // console.log('index set success');
                                                            });                                                              
                                                          }
                                                      } catch (err) {
                                                        console.log(err.message);
                                                      }
                                                }).then( () => {
                                                    mediaUploadTask.on(firebaseStorage.TaskEvent.STATE_CHANGED,
                                                        (snapshot) => {
                                                          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                                                          console.log('Upload is ' + progress + '% done');
                                                          this.setState({
                                                            progress: progress
                                                          });
                                                          switch (snapshot.state) {
                                                            case firebaseStorage.TaskState.PAUSED: // or 'paused'
                                                              // console.log('Upload is paused');
                                                              break;
                                                            case firebaseStorage.TaskState.RUNNING: // or 'running'
                                                              // console.log('Upload is running');
                                                              break;
                                                            default:
                                                              break;
                                                          }
                                                        }, (error) => {
                                                              switch (error.code) {
                                                                case 'storage/unauthorized':
                                                                  console.log('User doesn\'t have permission to access the object');
                                                                  break;
                                                                case 'storage/canceled':
                                                                  console.log('User canceled the upload');
                                                                  break;
                                                                case 'storage/unknown':
                                                                  console.log('Unknown error occurred, inspect error.serverResponse');
                                                                  break;
                                                                default:
                                                                  break;
                                                              }
                                                            }, () => {
                                                                mediaUploadTask.snapshot.ref.getDownloadURL().then(function(mediaURL) {
                                                                    try {
                                                                        userPostsRef.set({
                                                                          fileName,
                                                                          mediaURL,
                                                                          index,
                                                                          text,
                                                                          likes: 0,
                                                                          notes: 0,
                                                                          createdAt,
                                                                          height,
                                                                          width,
                                                                        });
                                                                        // console.log('isLoading: ' + thisComponent.state.isLoading);
                                                                        thisComponent.setState({
                                                                            isUploading: false,
                                                                            buttonSelectable: '',
                                                                            posting: 'Post',
                                                                            progress: 0,
                                                                        });
                                                                        console.log('mediaUpload update success...isLoading: ' + thisComponent.state.isLoading);
                                                                        close();
                                                                        setTimeout(() => {
                                                                            document.getElementById('hidden-refresh').click();
                                                                        }, 1000);
                                                                      } catch (error) {
                                                                        console.log('error updating user post ref', error.message);
                                                                        thisComponent.setState({
                                                                            isUploading: false,
                                                                            buttonSelectable: '',
                                                                            posting: 'Post',
                                                                            progress: 0,
                                                                        });
                                                                        close();
                                                                      }
                                                                  });
                                                                });
                                                        });
            					this.setState({
					              	file: '',
					              	filePreview: '',
					              	fileName: '',
					              	buttonVis: 'upload-icon',
                                    instructionsVis: 'instructions',
					              	imageRef: '',
					              	height: 0,
					              	width: 0,
                                    text: '',
                                    // isLoading: false
					              });
            				} else {
            					alert('Please upload a media file and/or select a size.');
            					return;
            				}
            				// console.log('posted');
            				// close();
            			}}
            			> {this.state.posting}
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
            </div>
        );
    }
}


export default UploadModal;
