import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHy7yHiTCqXSlctTizKBUeryZQ7DuBkWk",
  authDomain: "alternativeenergymanagement.firebaseapp.com",
  projectId: "alternativeenergymanagement",
  storageBucket: "alternativeenergymanagement.firebasestorage.app",
  messagingSenderId: "556263239998",
  appId: "1:556263239998:web:69d259c8fb8da7f0dbbc6f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
