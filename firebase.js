import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQ16iAzjDqygDWeaCgkVGJDYm7lmhxlT0",
  authDomain: "art-hosting.firebaseapp.com",
  projectId: "art-hosting",
  storageBucket: "art-hosting.firebasestorage.app",
  messagingSenderId: "542333465192",
  appId: "1:542333465192:web:131dff688b34ca79abc1dd",
  measurementId: "G-P1H09YHTXJ"
};




const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});



export {  auth, db};


