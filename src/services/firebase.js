// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9FODFc98qQ0Bo6rHKwThxgonNW1GOEDk",
  authDomain: "funtlibra-api.firebaseapp.com",
  projectId: "funtlibra-api",
  storageBucket: "funtlibra-api.firebasestorage.app",
  messagingSenderId: "246863983463",
  appId: "1:246863983463:web:57defa2919806ffd6ab5c2",
  measurementId: "G-0YEFT78VGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conecta ao Firestore
export const db = getFirestore(app);
export const auth = getAuth(app);
