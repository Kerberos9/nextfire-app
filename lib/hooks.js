import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from './firebase';
import { collection, getDoc, doc, onSnapshot } from '@firebase/firestore';

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        let unsubscribe;

        if (user) {
            const usersRef = collection(firestore, 'users');
            const docRef = doc(usersRef, user.uid);
            unsubscribe = onSnapshot(docRef, result => {
                setUsername(result.data()?.username);
            });
        } else {
            setUsername(null);
        }

        return unsubscribe;
    }, [user]);
    return { user, username };
}
