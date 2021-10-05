import {environment} from "./environments/environment";

importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
firebase.initializeApp({
  apiKey: environment.FirebaseConfig.apiKey,
  authDomain: environment.FirebaseConfig.authDomain,
  databaseURL: environment.FirebaseConfig.databaseURL,
  projectId: environment.FirebaseConfig.projectId,
  storageBucket: environment.FirebaseConfig.storageBucket,
  messagingSenderId: environment.FirebaseConfig.messagingSenderId,
  appId: environment.FirebaseConfig.appId,
  measurementId: environment.FirebaseConfig.measurementId
});

// Initialize Firebase
const messaging = firebase.messaging();
