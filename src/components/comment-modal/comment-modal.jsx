import React, { Component, Fragment } from 'react';
import { firestore, firebaseFirestore } from '../../firebase/firebase-utils';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';

import LoadingIndicator from '../loading-indicator/loading-indicator';
import CustomButton from '../custom-button/custom-button';

import './comment-modal.scss';




class CommentModal extends Component {


    constructor(props) {
        super(props);

        this.textAreaRef = React.createRef();

        this.state = {
        	notes: [],
        	justPosted: [],
        	error: false,
        	isLoading: true,
        	hasMore: true,
        	noteText: '',
        	lastCreatedAt: '',
        	lastText: '',
        	postingButtonText: 'Post',
        	stopSelect: '',
        	loadingText: 'Loading',
        	postDisplayName: '',
        }
    }

    componentDidMount() {
    	this.fetchNotes();
    	this.fetchDisplayName();
    	var body = document.getElementsByTagName( 'body' )[0];
    	body.setAttribute('class', 'noscroll');
    	// console.log('notes fetched');
    };

    shouldComponentUpdate(nextProps, nextState) {
    	return nextProps.imgName === this.props.imgName;
    };

    componentWillUnmount() {
		var body = document.getElementsByTagName( 'body' )[0];
		body.classList.remove('noscroll');
    };

    fetchDisplayName = () => {
    	const usernamesRef = firestore.collection('usernames');

    	if(!this.props.imgName) {
			return;
		}

    	usernamesRef.where('uid', '==', this.props.imgUid)
    				.limit(1)
    				.get()
    				.then((snapshot) => {
    					snapshot.forEach((doc) => {
    						this.setState({
    							postDisplayName: doc.id
    						});
    						// console.log(doc.id);
    					})
    				})
    				.catch((err) => {
    					console.log('Error fetching displayname: ' + err.message);
    				});
    };

    handleDelete = (event) => {
    	var result = window.confirm('Are you sure?');
    	const currNoteId = event.target.parentElement.getAttribute('notekey');

    	if(result === true) {
    		this.setState({
    			isLoading: true,
    			loadingText: 'Deleting'
    		});
    		const deleteNoteRef = firestore.doc(`users/${this.props.imgUid}/posts/${this.props.imgName}/notes/${currNoteId}`);
    		const postRef = firestore.doc(`users/${this.props.imgUid}/posts/${this.props.imgName}`);

    		event.target.parentElement.style.display = 'none';

    		deleteNoteRef.delete()
    					.then(() => {
    						postRef.update({
					    		notes: firebaseFirestore.FieldValue.increment(-1),
					    	})
					    	.then(() => {
					    		this.setState({
					    			isLoading: false,
					    			loadingText: 'Loading'
					    		});
					    	})
					    	.catch((err) => {
					    		this.setState({
					    			isLoading: false,
					    			loadingText: 'Loading'
					    		});
					    		console.log(err.message);
					    	});
    					})
    					.catch((err) => {
    						this.setState({
				    			isLoading: false,
				    			loadingText: 'Loading'
				    		});
    						console.log(err.message);
    					})
    		// console.log(event.target.parentElement);
    	} else {
    		return;
    	}
    	// console.log(event.target.parentElement);
    }

    handleNoteText = (event) => {
    	this.setState({
    		noteText: event.target.value,
    	});
    };

    handleScroll = debounce((event) => {
    	const divRef = document.getElementById('comments');

    	// console.log('scrollHeight: ' + divRef.scrollHeight + 'scrollTop: ' + divRef.scrollTop + 'clientHeight: ' + divRef.clientHeight);
    	if(this.state.error || this.state.isLoading || !this.state.hasMore) return;

    	if(divRef.scrollTop + divRef.clientHeight === divRef.scrollHeight) {
    		// console.log('bottom reached');
    		this.fetchNotes();
    	}
    }, 100);

    handlePost = () => {
		// console.log('handled post');
    	this.textAreaRef.current.value = "";

		this.setState({
			isLoading: true,
			postingButtonText: 'Posting',
			stopSelect: 'stop-select',
			loadingText: 'Posting'
		});
		const localUser = JSON.parse(localStorage.getItem('currentUser'));	
    	const uid = localUser.id;
    	const displayName = localUser.displayName;
    	const imageUrl = localUser.imageUrl;
    	const createdAt = new Date();
    	const text = this.state.noteText;
    	// const thisComponent = this;

    	const noteRef = firestore.collection(`users/${this.props.imgUid}/posts/${this.props.imgName}/notes`);
    	const postRef = firestore.doc(`users/${this.props.imgUid}/posts/${this.props.imgName}`);

    	if(!this.state.noteText || !this.state.noteText.replace(/\s/g, '').length) {
    		alert('Note is blank');
    		return;
    	}

    	noteRef.add({
    		createdAt,
    		text,
    		imageUrl,
    		displayName,
    		uid
    	}).then((ref) => {
    		const noteId = ref.id;
    		const newNoteRef = firestore.doc(`users/${this.props.imgUid}/posts/${this.props.imgName}/notes/${noteId}`)
    		const newNote = {
    			displayName,
				imageUrl,
				createdAt,
				text,
				uid,
				noteId,
    		};
    		// this.state.notes.unshift(newNote);

    		// console.log(JSON.stringify(newNote));

    		newNoteRef.update({
    			noteId,
    		}).then((result) => {
	    		this.setState({
	    			isLoading: false,
	    			postingButtonText: 'Post',
	    			stopSelect: '',
	    			justPosted: this.state.justPosted.concat(newNote),
	    			loadingText: 'Loading',
	    			// notes: this.state.notes,
	    		});
    		}).catch((err) => {
    			console.log(err);
    			this.setState({
	    			isLoading: false,
	    			postingButtonText: 'Post',
	    			stopSelect: '',
	    			loadingText: 'Loading',
	    		});
    		}); 		
    	}).catch((err) => {
    		console.log(err.message);
    		this.setState({
    			isLoading: false,
    			postingButtonText: 'Post',
    			stopSelect: '',
    			loadingText: 'Loading',
    			// notes: this.state.notes,
	    	});
    	});

    	postRef.update({
    		notes: firebaseFirestore.FieldValue.increment(1),
    	}).catch((err) => {
    		console.log(err.message);
    	});
    	// console.log(testVal);
	};

	fetchNotes = () => {
		if(!this.props.imgName) {
			return;
		}

		this.setState({
			isLoading: true,
		});

		const notesRef = firestore.collection(`users/${this.props.imgUid}/posts/${this.props.imgName}/notes`);

		notesRef.orderBy('createdAt', 'desc')
				.orderBy('text')
				.startAfter(this.state.lastCreatedAt, this.state.lastText)
				.limit(10)
				.get()
				.then((snapshot) => {
					const last = snapshot.docs[snapshot.docs.length - 1];

					const nextNotes = snapshot.docs.map(doc => ({
						displayName: doc.data().displayName,
						imageUrl: doc.data().imageUrl,
						createdAt: doc.data().createdAt,
						text: doc.data().text,
						uid: doc.data().uid,
						noteId: doc.data().noteId,
					}));

					this.setState({
						notes: this.state.notes.concat(nextNotes),
						isLoading: false,
						lastCreatedAt: last.data().createdAt,
						lastText: last.data().text,
					});
	    			// console.log(this.state.isLoading);
				})
				.catch((err) => {
					console.log(err.message);
					this.setState({
						isLoading: false,
					});
				});
	};

	clickClose = () => {
		document.getElementById('comment-close').click();
	};

	handleUserLink = () => {
		document.getElementById('user-note-link').click();
		// console.log('clicked');
	};

	// handleNoteMouseOver = (event) => {
	// 	this.setState({
	// 		noteLinkName: event.target.firstChild.getAttribute('alt'),
	// 	});
	// 	console.log(event.target);
	// };

	// handleNoteClick = (event) => {
	// 	document.getElementById('user-note-poster-link').click();
	// };

    render() {
    	// console.log('rendered...notes: ' + JSON.stringify(this.state.notes) + 'imgName: ' + this.state.imgName);

    	const {
	      error,
	      hasMore,
	      isLoading,
	      notes,
	      justPosted,
	    } = this.state;

        return (
            <div className='notes-modal'>
		        <div className='comment-modal' onClick={this.clickClose}>
		        </div>
	        	<a className="comment-close" id='comment-close' href=''>&times;</a>
	        	<div className='comment-image'>
	        		<img src={this.props.imgSrc} alt='image' className='notes-image'/>
	        	</div>
	        	<div className='comment-area'>
	        	<Link className='hidden-input' to={`/user/${this.state.postDisplayName}`} id='user-note-link' />
	        		<span className='comment-header' onClick={this.handleUserLink}>@{this.state.postDisplayName}</span>
	        		<div className='comments' id='comments' onScroll={this.handleScroll}>
	        			{/*<Link className='hidden-input' to={`/user/${this.state.postDisplayName}`} id='user-note-poster-link' />*/}
	        			{this.state.justPosted.length > 0 && 
	        				justPosted.slice().reverse().map(postedNote => (
	        						<Fragment key={postedNote.noteId}>
	        							<hr />
	        							<div style={{display: 'flex',
	        										backgroundColor: '#e6f7ff'
	        										}}
	        								notekey={postedNote.noteId}
	        							>
			        						<img alt={postedNote.displayName}
			        							src={postedNote.imageUrl}
			        							style={{
									                  borderRadius: '50%',
									                  border: '1px solid black',
									                  height: 20,
									                  marginRight: 5,
									                  marginLeft: 8,
									                  width: 20,
									                  pointerEvents: 'none',
									                }}
									        />
									        <div style={{pointerEvents: 'none',}}>
									        	<h5 style={{marginTop: '0.01vw'}}
									        	onClick={this.handleNoteClick}>
									        		@{postedNote.displayName}
									        	</h5>
									        	<p style={{marginTop: '-1.5vw',
									        			marginRight: '1vw',
									        			'textAlign': 'left'
									        			}}>
									        		{postedNote.text}
									        	</p>
									        	<p style={{fontSize: '0.8vw',
									        			fontStyle: 'italic',
									        			color: '#777',
									        			marginTop: '-1vw',
									        			marginBottom: '0vw'
									        	}}>
									        		{postedNote.createdAt.toDateString()}
									        	</p>
									        </div>
			        						{(JSON.parse(localStorage.getItem('currentUser')).id === this.props.imgUid) 
			        						|| (JSON.parse(localStorage.getItem('currentUser')).id === postedNote.uid)
			        						? <span className='note-delete' 
			        								style={{color: 'maroon',
			        										position: 'absolute',
			        										right: '5%',
			        										'alignContent': 'flex-end',
			        										padding: 0,
			        										}}
			        								onClick={this.handleDelete}
			        							>
			        							&times;
			        						  </span>
			        						: null
			        						}
			        					</div>
	        						</Fragment>
	        					))}
	        				<hr />

	        			{notes.map(note => (
	        				<Fragment key={note.noteId}>
	        					<hr />
	        					<div style={{display: 'flex'
	        								}}
	        						 notekey={note.noteId}
	        					>
	        						<img alt={note.displayName}
	        							src={note.imageUrl}
	        							style={{
							                  borderRadius: '50%',
							                  border: '1px solid black',
							                  height: 20,
							                  marginRight: 5,
							                  marginLeft: 8,
							                  width: 20,
							                  pointerEvents: 'none',
							                }}
							        />
							        <div style={{pointerEvents: 'none',}}>
							        	<h5 style={{marginTop: '0.01vw'}}>
							        		@{note.displayName}
							        	</h5>
							        	<p style={{marginTop: '-1.5vw',
							        			marginRight: '1vw',
							        			'textAlign': 'left'
							        			}}>
							        		{note.text}
							        	</p>
							        	<p style={{fontSize: '0.8vw',
							        			fontStyle: 'italic',
							        			color: '#777',
							        			marginTop: '-1vw',
							        			marginBottom: '0vw'
							        	}}>
							        		{note.createdAt.toDate().toDateString()}
							        	</p>
							        </div>
	        						{(JSON.parse(localStorage.getItem('currentUser')).id === this.props.imgUid) 
	        						|| (JSON.parse(localStorage.getItem('currentUser')).id === note.uid)
	        						? <span className='note-delete' 
	        								style={{color: 'maroon',
	        										position: 'absolute',
	        										right: '5%',
	        										'alignContent': 'flex-end',
	        										padding: 0,
	        										}}
	        								onClick={this.handleDelete}
	        							>
	        							&times;
	        						  </span>
	        						: null
	        						}
	        					</div>
	        				</Fragment>
	        			))}
	        			<hr />
	        			{this.isLoading && <div>Loading more notes...</div>}
	        			{this.error && <div>Could not load more notes</div>}
	        		</div>
	        		<div className='note-input' id='note-input'>
	    				<textarea ref={this.textAreaRef} className='note-text' id='note-text' maxLength={2000} rows={1} type='text' placeholder='Post a note...' onChange={this.handleNoteText} required />
	        		</div>
	        		{isLoading && <div className='notes-indicator'><LoadingIndicator className='loading-indicator' loadingText={this.state.loadingText} /></div>}
	        		<CustomButton className={`custom-button ${this.state.stopSelect}`} id='note-button' onClick={this.handlePost}>{this.state.postingButtonText}</CustomButton>
	        	</div>
        	</div>
        );
    }
}

export default CommentModal;
