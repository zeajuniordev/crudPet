import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCcivl0gl1H-pYGzkaBHZjdMOlduRckn0k",
    authDomain: "petcrud.firebaseapp.com",
    projectId: "petcrud",
    storageBucket: "petcrud.appspot.com",
    messagingSenderId: "677858912821",
    appId: "1:677858912821:web:4ac82ac8542f0c284a5f7c"
  }

export const firebaseApp = firebase.initializeApp(firebaseConfig)

// Firebase Auth instance — passwords are hashed server-side with bcrypt by Firebase
export const auth = firebase.auth(firebaseApp)

// Firestore database instance
export const db = firebase.firestore(firebaseApp)