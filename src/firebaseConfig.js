// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOJVbPFnByON1YsIy_-TJhmM7QRq-2kYE",
  authDomain: "kua-efa52.firebaseapp.com",
  projectId: "kua-efa52",
  storageBucket: "kua-efa52.appspot.com",
  messagingSenderId: "426851112089",
  appId: "1:426851112089:web:27f245c22f9a774f665408",
  measurementId: "G-98BPKLWYBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;