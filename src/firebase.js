// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBEU7Nmu0TSeNJURgLehiQ3ptG8rFj0pik',
  authDomain: 'react-pokemon-app-da02d.firebaseapp.com',
  projectId: 'react-pokemon-app-da02d',
  storageBucket: 'react-pokemon-app-da02d.appspot.com',
  messagingSenderId: '699861482501',
  appId: '1:699861482501:web:19a5e7ecde1100d574706c',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
