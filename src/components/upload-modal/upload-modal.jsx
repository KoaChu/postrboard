import React from 'react';
import Popup from 'reactjs-popup';

import { ReactComponent as Icon } from '../../assets/upload.svg';

import CustomButton from '../custom-button/custom-button';

import './upload-modal.scss';

const UploadModal = () => {
    return (
        <Popup trigger={<button className="open-button" id='modal-button'></button>} modal>
		    {close => (
		      <div className="modal">
		        <a className="close" onClick={close}>
		          &times;
		        </a>
		        <div className="content">
		          {" "}
		          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum.
		          Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam voluptates
		          delectus doloremque, explicabo tempore dicta adipisci fugit amet dignissimos?
		          <br />
		          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur sit
		          commodi beatae optio voluptatum sed eius cumque, delectus saepe repudiandae
		          explicabo nemo nam libero ad, doloribus, voluptas rem alias. Vitae?
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
		              console.log("modal closed ");
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
};

export default UploadModal;
