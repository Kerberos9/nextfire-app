import toast from 'react-hot-toast';
import {
    collectionGroup,
    query as fireQuery,
    where,
    orderBy,
    limit,
    getDocs,
    startAfter,
    Timestamp
} from '@firebase/firestore';
import { firestore, postToJSON } from '../lib/firebase';
import PostFeed from '../components/PostFeed';
import Loader from '../components/Loader';
import { useState } from 'react';
const LIMIT = 1;

export async function getServerSideProps(context) {
    const postsQuery = collectionGroup(firestore, 'posts');
    const query = fireQuery(
        postsQuery,
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        limit(LIMIT)
    );
    const posts = (await getDocs(query)).docs.map(postToJSON);
    return {
        props: { posts }
    };
}

export default function Home(props) {
    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);
    const [postsEnd, setPostsEnd] = useState(false);

    const getMorePosts = async () => {
        setLoading(true);
        console.log({ posts });

        const last = posts[posts.length - 1];
        const cursor =
            typeof last.createdAt === 'number'
                ? Timestamp.fromMillis(last.createdAt)
                : last.createdAt;

        const postsQuery = collectionGroup(firestore, 'posts');
        const query = fireQuery(
            postsQuery,
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(LIMIT),
            startAfter(cursor)
        );
        const newPosts = (await getDocs(query)).docs.map(doc => doc.data());

        setPosts(posts.concat(newPosts));
        setLoading(false);
        if (newPosts.length < LIMIT) {
            setPostsEnd(true);
        }
    };

    return (
        <main>
            <PostFeed posts={posts} />

            {!loading && !postsEnd && (
                <button onClick={getMorePosts}>Load more</button>
            )}

            <Loader show={loading} />

            {postsEnd && 'You have reached the end!'}
        </main>
    );
}
