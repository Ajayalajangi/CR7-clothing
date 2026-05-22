// Firebase configuration - DO NOT hardcode credentials in frontend
// Use environment variables or Firebase hosting's built-in config

// For production, use Firebase Hosting's environment configuration
// firebase functions:config:set admin.email="your-email" admin.uid="your-uid"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  orderBy,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Firebase config - these are safe to expose (they're public keys)
// Your security comes from Security Rules, not hiding these
const firebaseConfig = {
  apiKey: "AIzaSyBrXk_ltbvHPqbGnD_tIq8u9iNa_R3Bnlc",
  authDomain: "cr7-clothing-b4d5f.firebaseapp.com",
  projectId: "cr7-clothing-b4d5f",
  storageBucket: "cr7-clothing-b4d5f.firebasestorage.app",
  messagingSenderId: "671815729334",
  appId: "1:671815729334:web:d329c18205262c5221a617",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Helper function to check if user is admin
async function isAdmin(userId) {
  if (!userId) return false;
  const adminDoc = await getDoc(doc(db, "admins", userId));
  return adminDoc.exists() && adminDoc.data().isAdmin === true;
}

// Helper function to get current user role
async function getUserRole(userId) {
  if (!userId) return "customer";
  const adminDoc = await getDoc(doc(db, "admins", userId));
  if (adminDoc.exists() && adminDoc.data().isAdmin === true) {
    return adminDoc.data().role || "admin";
  }
  return "customer";
}

// Export all Firebase services
export {
  auth,
  db,
  storage,
  isAdmin,
  getUserRole,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updatePassword,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  orderBy,
  Timestamp,
  ref,
  uploadBytes,
  getDownloadURL,
};
