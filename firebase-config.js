// ============================================================
// LAPTOPLENS — Firebase Configuration
// ============================================================
// SETUP: Replace the values below with YOUR Firebase project details.
// Get these from: Firebase Console → Project Settings → Your Apps → SDK Setup
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCDb53qpAycW4ezUoRyYrD7xZHiu0ow1MM",
  authDomain: "laptoplens-52b08.firebaseapp.com",
  projectId: "laptoplens-52b08",
  storageBucket: "laptoplens-52b08.firebasestorage.app",
  messagingSenderId: "722337025641",
  appId: "1:722337025641:web:c1f1959ec1f52c5e5a1cf8",
  measurementId: "G-B48515XB0Q"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore database reference (used everywhere to read/write data)
const db = firebase.firestore();

// Firebase Auth reference (used for admin login)
const auth = firebase.auth();
