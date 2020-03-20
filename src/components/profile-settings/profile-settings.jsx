import React, { Component } from 'react';
import { auth, storageRef, firestore } from '../../firebase/firebase-utils';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

// import FormInput from '../form-input/form-input';
import CustomButton from '../custom-button/custom-button';

import { selectUserImage } from '../../redux/user/user-selectors';

import './profile-settings.scss';

class ProfileSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	imageUrl: props.imageUrl
        }
    }


    handleImageChange = (event) => {
    	const profileImage = event.target.files[0];

    	const imageRef = storageRef.child(`${auth.currentUser.uid}/profile-image`);

    	const userRef = firestore.doc(`users/${auth.currentUser.uid}`);

    	try {
			imageRef.put(profileImage)
					.then( () => {
						console.log("Uploaded successfully!");
					});
			imageRef.getDownloadURL()
					.then( (url) => {
						this.setState({
							imageUrl: url
						});
						userRef.update({imageUrl: url});
					});
		} catch (err) {
			alert('Upload canceled');
			console.log(err);
		}
    };

    render() {
        return (
        	<div className='profile-settings'>
	            <form className='settings-form' onSubmit={this.handleSubmit}>
	            	<div className='image-wrapper'>
	            		<img src={this.state.imageUrl} 
	            		alt='PROFILE' 
	            		className='profile-image'/>
	            	</div>
					<input type='file' id='profile-image-input' className='hidden-input' onChange={this.handleImageChange} />
					<CustomButton type='button' 
					onClick={() => {
						document.getElementById('profile-image-input').click();
					}}>
					Change Profile Picture
					</CustomButton>
					<CustomButton type='submit'>Save</CustomButton>
				</form>
			</div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
	imageUrl: selectUserImage
});

export default connect(mapStateToProps)(ProfileSettings);

