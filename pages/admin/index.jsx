import AuthCheck from '../../components/AuthCheck';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    setDoc
} from 'firebase/firestore';
import { firestore, auth } from '../../lib/firebase';
import PostFeed from '../../components/PostFeed';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { UserContext } from '../../lib/context';
import kebabCase from 'lodash.kebabcase';
import styles from '../../styles/Post.module.css';
import toast from 'react-hot-toast';
export default function AdminPage(props) {
    return (
        <main>
            <AuthCheck>
                <PostList />
                <CreateNewPost />
            </AuthCheck>
        </main>
    );
}

function PostList() {
    const [postsRef] = useCollection(
        collection(firestore, `users/${auth.currentUser.uid}/posts`)
    );
    const posts = postsRef?.docs.map(d => d.data());
    return (
        <>
            <h1>Manage your Posts</h1>
            <PostFeed posts={posts} admin />
        </>
    );
}

function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    const slug = encodeURI(kebabCase(title));
    const isValid = title.length > 3 && title.length < 100;

    const createPost = async e => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(firestore, `users/${uid}/posts/${slug}`);

        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: '# Hello world!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0
        };

        await setDoc(ref, data);

        toast.success(`Post ${title} created successfully!`);

        router.push(`/admin/${slug}`);
    };

    return (
        <form onSubmit={createPost}>
            <input
                value={title}
                placeholder='My Awesome Article'
                className={styles.input}
                type='text value={title}'
                onChange={e => setTitle(e.target.value)}
            />
            <p>
                <strong>{slug}</strong>
            </p>
            <button className='btn-green' disabled={!isValid} type='submit'>
                Create new post
            </button>
        </form>
    );
}
