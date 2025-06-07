// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCLPunRqpIWPbq4bt7S0e4JO_l6d6uGTdo",
//   authDomain: "prepnexus-b89b9.firebaseapp.com",
//   projectId: "prepnexus-b89b9",
//   storageBucket: "prepnexus-b89b9.firebasestorage.app",
//   messagingSenderId: "945930702757",
//   appId: "1:945930702757:web:163ca9049603ade3f4a24c",
//   measurementId: "G-4MLV66J1W6"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAbW7x_phtbAG83dH7JROAF-x-hwjvIJQ",
  authDomain: "prepnexus-b9328.firebaseapp.com",
  projectId: "prepnexus-b9328",
  storageBucket: "prepnexus-b9328.firebasestorage.app",
  messagingSenderId: "905643568779",
  appId: "1:905643568779:web:9aa9d37eb1f39716a8ee8e",
  measurementId: "G-YVQFD0QLDX"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);