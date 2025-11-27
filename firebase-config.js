// Firebase Configuration
// Replace these values with your Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyA3yrNVJwIPyDmq1bJ5efx6_UFEebTJoes",
    authDomain: "ccpl-coa-generator.firebaseapp.com",
    projectId: "ccpl-coa-generator",
    storageBucket: "ccpl-coa-generator.firebasestorage.app",
    messagingSenderId: "180993184050",
    appId: "1:180993184050:web:618c0f8fc25e187e01072b",
    measurementId: "G-TRMFS8SHNG"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Export for use in other files
window.db = db;
