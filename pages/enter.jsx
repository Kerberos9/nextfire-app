import {
    auth,
    firestore,
    googleAuthProvider,
    signInPopup
} from '../lib/firebase';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import { doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import debounce from 'lodash.debounce';
import toast from 'react-hot-toast';

export default function EnterPage({}) {
    const { user, username } = useContext(UserContext);
    return (
        <main>
            {user ? (
                !username ? (
                    <UsernameForm />
                ) : (
                    <SignOutButton />
                )
            ) : (
                <SignInButton />
            )}
        </main>
    );
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await signInPopup(auth, googleAuthProvider).catch(e =>
            e.code === 'auth/popup-closed-by-user'
                ? toast.error('Popup closed! Try again')
                : toast.error('Unknown error')
        );
    };

    return (
        <button className='btn-google' onClick={signInWithGoogle}>
            Log In with Google
        </button>
    );
}

function SignOutButton() {
    return (
        <button className='btn-google' onClick={() => auth.signOut()}>
            Sign Out
        </button>
    );
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, username } = useContext(UserContext);

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const onChange = e => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    const checkUsername = useCallback(
        debounce(async username => {
            if (username.length >= 3) {
                const docRef = doc(firestore, `usernames/${username}`);
                const exists = (await getDoc(docRef)).exists();

                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
        []
    );

    const onSubmit = async e => {
        try {
            e.preventDefault();
            console.log('Submitted');

            const userDoc = doc(firestore, `users/${user.uid}`);
            const usernameDoc = doc(firestore, `usernames/${formValue}`);

            const batch = writeBatch(firestore);
            batch.set(userDoc, {
                username: formValue,
                photoURL: user.photoURL,
                displayName: user.displayName,
                createdAt: serverTimestamp()
            });
            batch.set(usernameDoc, { uid: user.uid });
            await batch.commit();
        } catch (error) {
            console.error({ error });
        }
    };

    function UsernameMessage({ username, isValid, loading }) {
        if (loading) {
            return <p>Checking...</p>;
        } else if (isValid) {
            return <p className='text-success'>{username} is available!</p>;
        } else if (username && !isValid) {
            return (
                <p className='text-danger'>
                    That username is taken or not valid!
                </p>
            );
        } else {
            return <p></p>;
        }
    }
    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input
                        name='username'
                        placeholder='username'
                        value={formValue}
                        onChange={onChange}
                    />
                    <UsernameMessage
                        username={formValue}
                        isValid={isValid}
                        loading={loading}
                    />
                    <button
                        type='submit'
                        className='btn-green'
                        disabled={!isValid}>
                        Submit
                    </button>
                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
}
