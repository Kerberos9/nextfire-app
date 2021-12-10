import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import {
    getFirestore,
    collection,
    getDocs,
    where,
    query,
    limit,
    DocumentSnapshot
} from '@firebase/firestore';
import { getStorage } from '@firebase/storage';
import { useRouter } from 'next/router';

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

/**
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username) {
    const usersCollection = collection(firestore, 'users');
    const userQuery = query(usersCollection, where('username', '==', username));
    const userDoc = (await getDocs(userQuery)).docs[0];

    return userDoc;
}

/**
 * Converts timestamps from User
 * @param {DocumentSnapshot} doc
 *
 */
export function userToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        createdAt: data.createdAt.toMillis()
    };
}
/**
 * Converts timestamps from Post
 * @param {DocumentSnapshot} doc
 *
 */
export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis()
    };
}

export const auth = getAuth();
export const firestore = getFirestore();
export const storage = getStorage();
export const googleAuthProvider = new GoogleAuthProvider();
export const signInPopup = signInWithPopup;
