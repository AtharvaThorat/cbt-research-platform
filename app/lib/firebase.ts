import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration for SAR CBT Research Platform
// Client-side config (safe to expose)
const firebaseConfig = {
  apiKey: "AIzaSyCqxAmoKgQM8jjwTz_wYk9CqthtWAxw8Qc",
  authDomain: "sar-cbt-research-platform.firebaseapp.com",
  projectId: "sar-cbt-research-platform",
  storageBucket: "sar-cbt-research-platform.firebasestorage.app",
  messagingSenderId: "663096833730",
  appId: "1:663096833730:web:c796d3316f06ad67a92d5b",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export services used by the app
export const db = getFirestore(app);
export const auth = getAuth(app);
