// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAFaRbB4xghKT9ar-yxL4zIV3Gkl4Mo3_k",
  authDomain: "golden7meals.firebaseapp.com",
  projectId: "golden7meals",
  storageBucket: "golden7meals.firebasestorage.app",
  messagingSenderId: "89880966007",
  appId: "1:89880966007:web:dd78ef12b9bdba0032e772",
  measurementId: "G-16KT9WDV09",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db };
