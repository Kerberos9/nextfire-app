import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { auth } from '../lib/firebase';

export default function AuthCheck(props) {
    const { username } = useContext(UserContext);
    return username && auth.currentUser
        ? props.children
        : props.fallback || <Link href='/enter'>You must be signed in</Link>;
}
