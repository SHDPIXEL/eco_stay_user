import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZWDnbkCfLd6Pk2kcnjinT5ayxs600jgM",
  authDomain: "viryawildlife-c92c3.firebaseapp.com",
  projectId: "viryawildlife-c92c3",
  storageBucket: "viryawildlife-c92c3.appspot.com",
  messagingSenderId: "272424787692",
  appId: "1:272424787692:web:e609f0e1a71435e6014fc9",
  measurementId: "G-J9EWE1GX1X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
