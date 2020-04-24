import React, { Component, Fragment } from 'react';
import { firestore, firebaseFirestore } from '../../firebase/firebase-utils';
import debounce from 'lodash.debounce';

import CustomButton from '../custom-button/custom-button';

import './comment-modal.scss';




class CommentModal extends Component {


    constructor(props) {
        super(props);

        this.textAreaRef = React.createRef();

        this.state = {
        	notes: [],
        	error: false,
        	isLoading: true,
        	hasMore: true,
        	noteText: '',
        	lastCreatedAt: '',
        	lastText: '',
        }
    }

    componentDidMount() {
    	this.fetchNotes();
    	// console.log('notes fetched');
    };

    shouldComponentUpdate(nextProps, nextState) {
    	return nextProps.imgName === this.props.imgName;
    };

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
			isLoading: true
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
    		// console.log(ref.id);

    		newNoteRef.update({
    			noteId,
    		}).then((result) => {
	    		this.setState({
	    			isLoading: false
	    		});
    		}).catch((err) => {
    			console.log(err);
    		}); 		
    	}).catch((err) => {
    		console.log(err.message);
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
				});
	};

    render() {
    	// console.log('rendered...notes: ' + JSON.stringify(this.state.notes) + 'imgName: ' + this.state.imgName);

    	const {
	      error,
	      hasMore,
	      isLoading,
	      notes,
	    } = this.state;

        return (
            <div className='notes-modal'>
		        <div className='comment-modal'>
		        </div>
	        	<a className="comment-close" href='#'>&times;</a>
	        	<div className='comment-image'>
	        		<img src={this.props.imgSrc} alt='image' className='notes-image'/>
	        	</div>
	        	<div className='comment-area'>
	        		<span className='comment-header'>@posterUserName</span>
	        		<div className='comments' id='comments' onScroll={this.handleScroll}>
	        			{notes.map(note => (
	        				<Fragment key={note.noteId}>
	        					<hr />
	        					<div style={{display: 'flex'}}>
	        						<img alt={note.displayName}
	        							src={note.imageUrl}
	        							style={{
							                  borderRadius: '50%',
							                  border: '1px solid black',
							                  height: 20,
							                  marginRight: 5,
							                  marginLeft: 8,
							                  width: 20,
							                }}
							        />
							        <div>
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
	        		<CustomButton id='note-button' onClick={this.handlePost}>Post</CustomButton>
	        	</div>
        	</div>
        );
    }
}

export default CommentModal;


// const CommentModal = ({ imgSrc, imgUid, imgName }) => {

// 	const [notes, setNotes] = useState([]);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [error, setError] = useState(false);
// 	const [hasMore, setHasMore] = useState(true);

// 	const handlePost = () => {
// 		console.log('handlepost');
// 	};

// 	const fetchNotes = () => {
// 		setIsLoading(true);

// 		const notesRef = firestore.collection(`users/${imgUid}/posts/${imgName}/notes`);

// 		notesRef.orderBy('createdAt', 'desc')
// 				.limit(10)
// 				.get()
// 				.then((snapshot) => {
// 					const nextNotes = snapshot.docs.map(doc => ({
// 						displayName: doc.id,
// 						imageUrl: doc.data().imageUrl,
// 						createdAt: doc.data().createdAt,
// 						text: doc.data().text,
// 						noteUid: doc.data().uid
// 					}));
// 				})
// 				.then(() => {
// 					setNotes(nextNotes);
// 					setIsLoading(false);
// 				})
// 				.catch((err) => {
// 					console.log(err.message);
// 				});
// 	};

//     return (
//     	<div className='notes-modal'>
// 	        <div className='comment-modal'>
// 	        </div>
//         	<a class="comment-close" href='#'>&times;</a>
//         	<div className='comment-image'>
//         		<img src={imgSrc} alt='post-image' className='notes-image'/>
//         	</div>
//         	<div className='comment-area'>
//         		<span className='comment-header'>@posterUserName</span>
//         		<div className='comments'>

//         		</div>
//         		<div className='note-input'>
//     				<textarea className='note-text' id='note-text' rows={1} type='text' placeholder='Post a note...' onChange={() => {console.log('hi');}} required />
//         		</div>
//         		<CustomButton id='note-button' onClick={handlePost}>Post</CustomButton>
//         	</div>
//         </div>
//     );
// };


// export default CommentModal;