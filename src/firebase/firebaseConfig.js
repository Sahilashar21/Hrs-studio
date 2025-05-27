// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace below config with your actual firebaseConfig from Firebase console
const firebaseConfig = {
    apiKey: "AIzaSyB3eu10iNGChmQwqUYTjLjf_nVausLFU5w",
    authDomain: "hrs-karaoke-wallet.firebaseapp.com",
    projectId: "hrs-karaoke-wallet",
    storageBucket: "hrs-karaoke-wallet.firebasestorage.app",
    messagingSenderId: "249949336987",
    appId: "1:249949336987:web:37b1f58a321990ee211d3e",
    measurementId: "G-HHXE6KY10J"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
