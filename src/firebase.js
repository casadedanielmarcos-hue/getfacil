import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBRc8ua_EDwtRjrt2c5A_mdPFaD7Utqewo",
  authDomain: "getfuturetoday.firebaseapp.com",
  projectId: "getfuturetoday",
  storageBucket: "getfuturetoday.firebasestorage.app",
  messagingSenderId: "486577793724",
  appId: "1:486577793724:web:a9ab0998acd8252255beb9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
