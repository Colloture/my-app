/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);

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

messaging.onBackgroundMessage(payload => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );

  // Customize notification here
  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: '/favicon.png',
  // };

  // return self.registration.showNotification(
  //   notificationTitle,
  //   notificationOptions
  // );
});
