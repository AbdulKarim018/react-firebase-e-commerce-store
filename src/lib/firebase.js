import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCu08pN-UftmdeCnb7eANXGvZSuJroZfTg",
  authDomain: "smit-firebase-e6ef5.firebaseapp.com",
  projectId: "smit-firebase-e6ef5",
  storageBucket: "smit-firebase-e6ef5.appspot.com",
  messagingSenderId: "175151531259",
  appId: "1:175151531259:web:7061c6ed843617ee265c5e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const productCollectionRef = collection(db, "products");
const userCollectionRef = collection(db, "furniro_users");

export { app, auth, db, productCollectionRef, userCollectionRef };
