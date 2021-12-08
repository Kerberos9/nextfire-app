import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { getFirestore, collection, getDoc } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyCYumSYCkuk-p_WoGhD68AGSFRlGO_9Vag',
    authDomain: 'kerberos-nextfire.firebaseapp.com',
    projectId: 'kerberos-nextfire',
    storageBucket: 'kerberos-nextfire.appspot.com',
    messagingSenderId: '461833158430',
    appId: '1:461833158430:web:dd3343d9f36d8090ee130f',
    measurementId: '${config.measurementId}'
};

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const firestore = getFirestore();
export const storage = getStorage();
export const googleAuthProvider = new GoogleAuthProvider();
export const signInPopup = signInWithPopup;
