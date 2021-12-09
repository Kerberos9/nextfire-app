import PostFeed from '../../components/PostFeed';
import UserProfile from '../../components/UserProfile';
import {
    getUserWithUsername,
    postToJSON,
    userToJSON
} from '../../lib/firebase';
import {
    where,
    orderBy,
    limit,
    getDocs,
    query as fireQuery,
    collection
} from '@firebase/firestore';

export async function getServerSideProps({ query }) {
    const { username } = query;
    const userDoc = await getUserWithUsername(username);
    let posts = [];
    if (userDoc) {
        const postsQuery = fireQuery(
            collection(userDoc.ref, 'posts'),
            where(
                'published',
                '==',
                true,
                orderBy('createdAt', 'desc'),
                limit(5)
            )
        );

        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }

    const user = userToJSON(userDoc);

    return {
        props: { user, posts }
    };
}

export default function UsernamePage({ user, posts }) {
    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}
