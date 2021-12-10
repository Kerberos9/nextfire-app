import { signOut } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { auth } from '../lib/firebase';
export default function Navbar({}) {
    const { user, username } = useContext(UserContext);
    const router = useRouter();
    const logOut = () => {
        router.push('/');
        signOut(auth);
    };
    return (
        <nav className='navbar'>
            <ul>
                <li>
                    <Link href='/' passHref>
                        <button className='btn-logo'>Feed</button>
                    </Link>
                </li>
                {username && (
                    <>
                        <li>
                            <Link href='/admin' passHref>
                                <button className='btn-blue'>
                                    Write Posts
                                </button>
                            </Link>
                        </li>
                        <li>
                            <button className='btn-grey' onClick={logOut}>
                                Logout
                            </button>
                        </li>
                        <li>
                            <Link href={`/${username}`} passHref>
                                <img
                                    src={user?.photoURL}
                                    alt='User profile picture'
                                />
                            </Link>
                        </li>
                    </>
                )}
                {!username && (
                    <>
                        <li>
                            <Link href='/enter' passHref>
                                <button className='btn-blue'>Log in</button>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}
