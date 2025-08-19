import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_NATIVE_FIREBASE_API_KEY, 
  REACT_NATIVE_FIREBASE_AUTHDOMAIN, 
  REACT_NATIVE_FIREBASE_PROJECTID, 
  REACT_NATIVE_FIREBASE_STORAGE_BUCKET, 
  REACT_NATIVE_FIREBASE_MESSAGING_SENERID,
REACT_NATIVE_FIREBASE_APPID,
REACT_NATIVE_FIREBASE_MEASURMENTID
} from '@env'

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: REACT_NATIVE_FIREBASE_API_KEY,
  authDomain: REACT_NATIVE_FIREBASE_AUTHDOMAIN,
  projectId:REACT_NATIVE_FIREBASE_PROJECTID,
  storageBucket:REACT_NATIVE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_NATIVE_FIREBASE_MESSAGING_SENERID,
  appId: REACT_NATIVE_FIREBASE_APPID,
  measurementId: REACT_NATIVE_FIREBASE_MEASURMENTID
};




const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});



export {  auth, db};


