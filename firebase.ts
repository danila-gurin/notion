// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAsNqk6hZhbuN5RH3QrHHq3lilck67mkf8',
  authDomain: 'notion-84fc2.firebaseapp.com',
  projectId: 'notion-84fc2',
  storageBucket: 'notion-84fc2.firebasestorage.app',
  messagingSenderId: '70178934624',
  appId: '1:70178934624:web:2fa02025f81ad0d2e91805',
  measurementId: 'G-R7H5VBNJVF',
};

// Initialize Firebase
const app = getApps().length == 0 ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
