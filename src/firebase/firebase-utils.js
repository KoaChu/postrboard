import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

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

  firebase.initializeApp(config);

  export const auth = firebase.auth();
  export const firestore = firebase.firestore();


  export default firebase;