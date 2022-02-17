import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/messaging';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDh6x4YofHh9jglRGmixGNAATQm959ao7M',
  authDomain: 'uber-policia.firebaseapp.com',
  databaseURL: 'https://uber-policia-default-rtdb.firebaseio.com',
  projectId: 'uber-policia',
  storageBucket: 'uber-policia.appspot.com',
  messagingSenderId: '1051336561227',
  appId: '1:1051336561227:web:a937af8c2fa89dc0ea73ce',
  measurementId: 'G-1TJLF7H01E',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
const firestore = firebase.firestore();
const { REACT_APP_VAPID_KEY } = process.env;
const publicKey = REACT_APP_VAPID_KEY;

//Firebase firestore persistence
firestore.enablePersistence().catch(function (err) {
  //Multiple tabs opened , persitence can only be enabled in one tab at a time
  if (err.code === 'failed-precodination') {
    console.log('Multiple tabs open, persistence cannot be enabled');
  } else if (err.code === 'unimplemented') {
    //The current browser does not support all the features required to enable persitence
    console.log('The Current Browser Does Not Support');
  }
});

//Messaging getToken
export const getToken = async setTokenFound => {
  let currentToken = '';
  try {
    currentToken = await messaging.getToken({ vapidKey: publicKey });
    if (currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
  }
};

// //Messaging message listener
// export const onMessageListener = () =>
//   new Promise(resolve => {
//     messaging.onMessage(payload => {
//       resolve(payload);
//     });
//   });

//   messaging
//   .getToken({
//     vapidKey:
//       'BASv8Cqb4oRyi4ehkKqM4JbIY9eGw-pJqqP5Jdmhdb8OBLrqVrDTrd54ZqhUNE65ml0ppsMyGRA9DQOziMI2xhc',
//   })
//   .then(currentToken => {
//     if (currentToken) {
//       // Send the token to your server and update the UI if necessary
//       console.log('tkn: ', currentToken);
//       // ...
//     } else {
//       // Show permission request UI
//       console.log(
//         'No registration token available. Request permission to generate one.'
//       );
//       // ...
//     }
//   })
//   .catch(err => {
//     console.log('An error occurred while retrieving token. ', err);
//     // ...
//   });

// messaging.onMessage(payload => {
//   console.log('Message received. ', payload);
//   // ...
// });

export default firebase;
