import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyDJ2Haz69kVjpMlz9LqacCPO3nwgIJZ2Eo",
    authDomain: "postrboard-fb16b.firebaseapp.com",
    databaseURL: "https://postrboard-fb16b.firebaseio.com",
    projectId: "postrboard-fb16b",
    storageBucket: "postrboard-fb16b.appspot.com",
    messagingSenderId: "618287962351",
    appId: "1:618287962351:web:136e42341abacba452631a",
    measurementId: "G-F461BL5NSJ"
  };

  export const createUserProfileDocument = async (userAuth, additionalData) => {
  	if(!userAuth) return;

  	const userRef = firestore.doc(`users/${userAuth.uid}`);

  	const snapShot = await userRef.get();

  	if(!snapShot.exists) {
  		const { displayName, email } = userAuth;
  		const createdAt = new Date();

  		try {
  			await userRef.set({
  				displayName,
  				email,
  				createdAt,
  				...additionalData
  			})
  		} catch (error) {
  			console.log('error creating user', error.message);
  		}
  	}

  	return userRef;
  };

  export const createUsernameDocument = async (userAuth, {displayName}) => {
    if(!userAuth) return;

    const usernameRef = firestore.doc(`usernames/${displayName}`);

    const usernameSnapShot = await usernameRef.get();

    if(!usernameSnapShot.exists) {
      const uid = userAuth.uid;

      try {
        await usernameRef.set({
          uid,
        })
      } catch (error) {
        console.log('error creating username', error.message);
      }
    }

    return usernameRef;
  };

  export const getUserProfileImage = async (userAuth, additionalData) => {
    if(!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);
    var profileImage = '';

    try {
      userRef.get()
              .then((snap) => {
                profileImage = snap.imageUrl;
              });
    } catch (err) {
      console.log(err);
    }
    console.log(profileImage);
    return profileImage;
  };

  export const setUserPosts = async (mediaUrl, text, fileName) => {

    const userPostsRef = firestore.doc(`users/${auth.currentUser.uid}/posts/${fileName}`);
    const createdAt = new Date();

    try {
        await userPostsRef.set({
          mediaUrl,
          text,
          likes: 0,
          notes: 0,
          createdAt,
        })
      } catch (error) {
        console.log('error updating user post ref', error.message);
      }

  };

  export const uploadUserMedia = async (file, additionalData) => {
    const imageRef = storageRef.child(`${auth.currentUser.uid}/${file.name}`);

    try {
      imageRef.put(file)
          .then( () => {
            console.log("Uploaded successfully!");
          });
    } catch (err) {
      alert('Upload canceled');
      console.log(err);
    }
  };


  export const actionCodeSettings = {
    url: 'http://localhost:3000/'
  };

  firebase.initializeApp(config);

  export const auth = firebase.auth();
  export const firestore = firebase.firestore();
  export const storageRef = firebase.storage().ref();


  export default firebase;