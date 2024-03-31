import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, Timestamp } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//인증 초기화 하기
const appAuth = getAuth();
//파이어베이스 초기화하기
const appFireStore = getFirestore(app);
const timeStamp = Timestamp;


export { appAuth, appFireStore, timeStamp }