// firebase-config.js
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1dlbXXE5bUgt_KrUa5ALqtWx61qTipU8",
  authDomain: "sk-scoring-cric.firebaseapp.com",
  databaseURL: "https://sk-scoring-cric-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sk-scoring-cric",
  storageBucket: "sk-scoring-cric.firebasestorage.app",
  messagingSenderId: "481008550157",
  appId: "1:481008550157:web:483f4f9ff383812946f044",
  measurementId: "G-S4MSGJBMLB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Database reference helper
const db = firebase.database();
