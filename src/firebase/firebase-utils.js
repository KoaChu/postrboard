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
          displayName,
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
    // console.log(profileImage);
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

  // export const uploadUserMedia = async (file, text, fileName, height, width) => {

  //   var mediaUploadTask = storageRef.child(`${auth.currentUser.uid}/${file.name}`).put(file);

  //   const userDocRef = firestore.collection(`users/${auth.currentUser.uid}/posts`);
  //   const userPostsRef = firestore.doc(`users/${auth.currentUser.uid}/posts/${fileName}`);

  //   const createdAt = new Date();

  //    await userDocRef.orderBy('index', 'desc')
  //       .limit(1)
  //       .get()
  //       .then((snapShot) => {
  //         if(snapShot.size===0) {
  //           userPostsRef.set({
  //             index: 0,
  //           })
  //           // console.log('first index set success');
  //         } else {
  //             snapShot.forEach((doc) => {
  //             var data = doc.data();
  //             var index = data.index + 1;

  //             userPostsRef.set({
  //               index,
  //             });
  //             // console.log('index set success');
  //           });
              
  //         }
  //       }).then((snap) => {
  //         mediaUploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
  //           (snapshot) => {
  //             var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

  //             console.log('Upload is ' + progress + '% done');
  //             switch (snapshot.state) {
  //               case firebase.storage.TaskState.PAUSED: // or 'paused'
  //                 // console.log('Upload is paused');
  //                 break;
  //               case firebase.storage.TaskState.RUNNING: // or 'running'
  //                 // console.log('Upload is running');
  //                 break;
  //               default:
  //                 break;
  //             }
  //           }, (error) => {
  //                 switch (error.code) {
  //                   case 'storage/unauthorized':
  //                     console.log('User doesn\'t have permission to access the object');
  //                     break;
  //                   case 'storage/canceled':
  //                     console.log('User canceled the upload');
  //                     break;
  //                   case 'storage/unknown':
  //                     console.log('Unknown error occurred, inspect error.serverResponse');
  //                     break;
  //                   default:
  //                     break;
  //                 }
  //               }, () => {
  //                   mediaUploadTask.snapshot.ref.getDownloadURL().then(function(mediaURL) {
  //                       try {
  //                           userPostsRef.update({
  //                             fileName,
  //                             mediaURL,
  //                             text,
  //                             likes: 0,
  //                             notes: 0,
  //                             createdAt,
  //                             height,
  //                             width,
  //                           })
  //                           console.log('mediaUpload update success');
  //                         } catch (error) {
  //                           console.log('error updating user post ref', error.message);
  //                         }
  //                     });
  //                   });
  //       });

  //       return "Kim Kim Kim";
              
  //   // return 1;
  // };

  export const updatePushDown = async (oldDBIndex, newDBIndex) => {
    const userDocRef = firestore.collection(`users/${auth.currentUser.uid}/posts`);

    userDocRef.where('index', '==', oldDBIndex)
              .limit(1)
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {     
                  var refName = doc.id;
                  var userPostRef = firestore.doc(`users/${auth.currentUser.uid}/posts/${refName}`);
                  // console.log(refName);

                  userPostRef.update({
                    index: newDBIndex
                  });
                });
              })
              .catch((err) => {
                console.log(err.message);
              });

    userDocRef.where('index', '<=', newDBIndex).where('index', '>', oldDBIndex)
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  var data = doc.data();
                  var refName = doc.id;
                  var currIndex = data.index;

                  var userPostRef = firestore.doc(`users/${auth.currentUser.uid}/posts/${refName}`);

                  userPostRef.update({
                    index: currIndex - 1
                  });
                });
              })
              .catch((err) => {
                console.log(err.message);
              });

  };

  export const updatePushUp = async (oldDBIndex, newDBIndex) => {
  const userDocRef = firestore.collection(`users/${auth.currentUser.uid}/posts`);

  userDocRef.where('index', '==', oldDBIndex)
            .limit(1)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {     
                var refName = doc.id;
                var userPostRef = firestore.doc(`users/${auth.currentUser.uid}/posts/${refName}`);
                // console.log(refName);

                userPostRef.update({
                  index: newDBIndex
                });
              });
            })
            .catch((err) => {
              console.log(err.message);
            });

  userDocRef.where('index', '>=', newDBIndex).where('index', '<', oldDBIndex)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var data = doc.data();
                var refName = doc.id;
                var currIndex = data.index;

                var userPostRef = firestore.doc(`users/${auth.currentUser.uid}/posts/${refName}`);

                userPostRef.update({
                  index: currIndex + 1
                });
              });
            })
            .catch((err) => {
              console.log(err.message);
            });

};

  export const onDeleteIndexes = async (currDeleteIndex) => {
    const userDocRef = firestore.collection(`users/${auth.currentUser.uid}/posts`);
    // console.log(currIndex);

    userDocRef.where('index', '>', currDeleteIndex)
              .get()
              .then((snapshot) => {
                // console.log(snapshot);
                snapshot.forEach((doc) => {
                  var data = doc.data();
                  var refName = doc.id;
                  var currentIndex = data.index;

                  // console.log(data);

                  var userPostRef = firestore.doc(`users/${auth.currentUser.uid}/posts/${refName}`);

                  userPostRef.update({
                    index: currentIndex - 1
                  });
                });
              })
              .catch((err) => {
                console.log(err.message);
              });
  };

  // export const userLikeColl = () => {
  //   if(firestore.collection(`users/${auth.currentUser.uid}/likes`)) {
  //     const userLikesRef = firestore.collection(`users/${auth.currentUser.uid}/likes`);

  //     userLikesRef.get()
  //                 .then((snapshot) => {
  //                   const likesList = snapshot.docs.map(doc => ({
  //                     postId: doc.data().fileName,
  //                   }));
  //                   return likesList;
  //                 })
  //                 .catch((err) => {
  //                   console.log(err.message);
  //                 });
  //   } else {
  //     return false;
  //   }
  // };

  export const actionCodeSettings = {
    url: 'http://localhost:3000/'
  };

  firebase.initializeApp(config);

  export const auth = firebase.auth();
  export const firestore = firebase.firestore();
  export const storageRef = firebase.storage().ref();
  export const firebaseStorage = firebase.storage;
  export const firebaseFirestore = firebase.firestore;


  export default firebase;