// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxcnkQkUDSSvcZ-P5chsEVCFyNGd9h4_w",
  authDomain: "medtrust-cad19.firebaseapp.com",
  projectId: "medtrust-cad19",
  storageBucket: "medtrust-cad19.firebasestorage.app",
  messagingSenderId: "74339883698",
  appId: "1:74339883698:web:ab80bac932f46fd195c7ab",
  measurementId: "G-4LJLN99C9P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };