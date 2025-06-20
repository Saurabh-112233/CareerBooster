// Import the functions you need from the SDKs you need
import { initializeApp, getApps,getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpmjW8TQNaqfEJWe1dzcg6ObYbEmjqSXg",
  authDomain: "prepwise-4ae09.firebaseapp.com",
  projectId: "prepwise-4ae09",
  storageBucket: "prepwise-4ae09.firebasestorage.app",
  messagingSenderId: "124947900016",
  appId: "1:124947900016:web:362339cbfa04bb084af6b5",
  measurementId: "G-6ZRQF4CEEY"
};

// Initialize Firebase
const app =!getApps.length ? initializeApp(firebaseConfig):getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);