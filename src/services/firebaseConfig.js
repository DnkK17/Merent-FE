// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB1IiprNdjO-koO9jIFUm7ADitSraRcLRk",
  authDomain: "merent-242d6.firebaseapp.com",
  projectId: "merent-242d6",
  storageBucket: "merent-242d6.appspot.com",
  messagingSenderId: "585603417443",
  appId: "1:585603417443:web:4ce1c1c6168469a7b07f56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Storage và Firestore
export const storage = getStorage(app);
export const db = getFirestore(app);
