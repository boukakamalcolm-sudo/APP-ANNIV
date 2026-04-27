import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2RhBJsEWjZtC9WVdbtjlxETtWLXw8-9o",
  authDomain: "anniversaire0606.firebaseapp.com",
  projectId: "anniversaire0606",
  storageBucket: "anniversaire0606.firebasestorage.app",
  messagingSenderId: "126469245970",
  appId: "1:126469245970:web:9b8538666ce0e63da6dccb",
  measurementId: "G-7BTWSDQMNE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);