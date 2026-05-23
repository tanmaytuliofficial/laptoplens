// ============================================================
// LAPTOPLENS — Firebase Configuration
// ============================================================
// SETUP: Replace the values below with YOUR Firebase project details.
// Get these from: Firebase Console → Project Settings → Your Apps → SDK Setup
// ============================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore database reference (used everywhere to read/write data)
const db = firebase.firestore();

// Firebase Auth reference (used for admin login)
const auth = firebase.auth();
