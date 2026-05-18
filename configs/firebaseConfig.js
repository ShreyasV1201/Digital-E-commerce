// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ecommerce-cff9d.firebaseapp.com",
  projectId: "ecommerce-cff9d",
  storageBucket: "ecommerce-cff9d.firebasestorage.app",
  messagingSenderId: "839785032386",
  appId: "1:839785032386:web:520f2b1f5130fdae23e95b",
  measurementId: "G-DQJW06EFEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app);