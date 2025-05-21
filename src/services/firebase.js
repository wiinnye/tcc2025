// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDrxxlATxm0FNEXihrvTFwrGW1OKBx2VO8",
  authDomain: "funtlibra-8920d.firebaseapp.com",
  projectId: "funtlibra-8920d",
  storageBucket: "funtlibra-8920d.firebasestorage.app",
  messagingSenderId: "354399317897",
  appId: "1:354399317897:web:7460a533ecec77f6f57b58",
  measurementId: "G-S4VPBQ44F2"

};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
