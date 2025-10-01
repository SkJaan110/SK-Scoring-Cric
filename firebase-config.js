// firebase-config.js
// REPLACE the placeholder values below with YOUR Firebase project's config.
// Get your config from Firebase Console -> Project Settings -> Your apps (Web)
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_PROJECT.firebaseapp.com",
  databaseURL: "https://REPLACE_WITH_YOUR_DATABASE.firebaseio.com",
  projectId: "REPLACE_WITH_PROJECT_ID",
  storageBucket: "REPLACE_WITH_PROJECT.appspot.com",
  messagingSenderId: "REPLACE_SENDER_ID",
  appId: "REPLACE_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Database reference helper
const db = firebase.database();
