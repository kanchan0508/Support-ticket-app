import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDf2WYKiWSHbx2GSizgmdnOjSqt74NGhh0",
  authDomain: "support-ticket-9349b.firebaseapp.com",
  projectId: "support-ticket-9349b",
  storageBucket: "support-ticket-9349b.firebasestorage.app",
  messagingSenderId: "720990419788",
  appId: "1:720990419788:web:41c915f967c9075a55ade9",
  measurementId: "G-1MVER26N9H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);