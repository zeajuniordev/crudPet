import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCcivl0gl1H-pYGzkaBHZjdMOlduRckn0k",
    authDomain: "petcrud.firebaseapp.com",
    projectId: "petcrud",
    storageBucket: "petcrud.appspot.com",
    messagingSenderId: "677858912821",
    appId: "1:677858912821:web:4ac82ac8542f0c284a5f7c"
  }

export const firebaseApp = firebase.initializeApp(firebaseConfig)