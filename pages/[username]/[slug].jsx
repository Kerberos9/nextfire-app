import { doc, getDoc, collectionGroup, getDocs } from 'firebase/firestore';
import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if (userDoc) {
        const postRef = doc(userDoc.ref, `/posts/${slug}`);
        post = postToJSON(await getDoc(postRef));
        path = postRef.path;
    }

    return {
        props: { post, path },
        revalidate: 5000
    };
}

export async function getStaticPaths() {
    const postsQuery = collectionGroup(firestore, 'posts');
    const posts = await getDocs(postsQuery);

    const paths = posts.docs.map(d => {
        const { slug, username } = d.data();
        return {
            params: { username, slug }
        };
    });

    return {
        paths,
        fallback: 'blocking'
    };
}

export default function PostPage(props) {
    const postRef = doc(firestore, props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;
    return (
        <main className={styles.container}>
            <section>
                <PostContent post={post} />
            </section>

            <aside className='card'>
                <p>
                    <strong>{post.heartCount || 0} ♥</strong>
                </p>
            </aside>
        </main>
    );
}
