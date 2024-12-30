// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-405c1.firebaseapp.com",
  projectId: "mern-estate-405c1",
  storageBucket: "mern-estate-405c1.firebasestorage.app",
  messagingSenderId: "444466351505",
  appId: "1:444466351505:web:b37dc6ec3edc4c08571e30"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);