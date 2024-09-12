// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATrYsVLDMqv9XCd2FKtomlsu2yqb2A0Rw",
  authDomain: "state-park-app-aa4ee.firebaseapp.com",
  projectId: "state-park-app-aa4ee",
  storageBucket: "state-park-app-aa4ee.appspot.com",
  messagingSenderId: "420674417189",
  appId: "1:420674417189:web:f848c3b508895b19acc5cc",
  measurementId: "G-2H6H69TNF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
//const analytics = getAnalytics(app);