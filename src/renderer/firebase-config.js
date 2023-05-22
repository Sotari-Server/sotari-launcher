// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { OAuthProvider, getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCF7ib9dyErf_mrEdbka-uHc5gOMCqNtMk',
  authDomain: 'sotari.firebaseapp.com',
  projectId: 'sotari',
  storageBucket: 'sotari.appspot.com',
  messagingSenderId: '381925499967',
  appId: '1:381925499967:web:46a7bc391086eaa255c48a',
  measurementId: 'G-VMJ6EEVPL3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const GoogleProvider = new GoogleAuthProvider();
export const MicrosoftProvider = new OAuthProvider('microsoft.com');
MicrosoftProvider.setCustomParameters({
  tenant: 'common',
});
