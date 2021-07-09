import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDh6x4YofHh9jglRGmixGNAATQm959ao7M",
  authDomain: "uber-policia.firebaseapp.com",
  databaseURL: "https://uber-policia-default-rtdb.firebaseio.com",
  projectId: "uber-policia",
  storageBucket: "uber-policia.appspot.com",
  messagingSenderId: "1051336561227",
  appId: "1:1051336561227:web:a937af8c2fa89dc0ea73ce",
  measurementId: "G-1TJLF7H01E",
};

firebase.initializeApp(firebaseConfig);
//Firebase firestore persistence

firebase
  .firestore()
  .enablePersistence()
  .catch(function (err) {
    //Multiple tabs opened , persitence can only be enabled in one tab at a time
    if (err.code === "failed-precodination") {
      console.log("Multiple tabs open, persistence cannot be enabled");
    } else if (err.code === "unimplemented") {
      //The current browser does not support all the features required to enable persitence
      console.log("The Current Browser Does Not Support");
    }
  });

export default firebase;
