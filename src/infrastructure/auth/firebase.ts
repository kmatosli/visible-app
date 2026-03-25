/**
 * ============================================================
 * File: firebase.ts
 * Purpose: Firebase initialization for Visible app.
 * Services: Auth, Firestore
 * ============================================================
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGjSVtETvqCKBgxJeILMDL8JzWGeydmJU",
  authDomain: "visible-app-245f1.firebaseapp.com",
  projectId: "visible-app-245f1",
  storageBucket: "visible-app-245f1.firebasestorage.app",
  messagingSenderId: "1074551896778",
  appId: "1:1074551896778:web:3bbc1e2497d4f7c9c0d233",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
