import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth } from '../../lib/firebase';
import styles from '../../styles/Admin.module.css';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ImageUploader from '../../components/ImageUploader';

export default function AdminPostEdit(props) {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    );
}

function PostForm({ defaultValues, postRef, preview }) {
    const { register, handleSubmit, reset, watch, formState } = useForm({
        defaultValues,
        mode: 'onChange'
    });

    const { isValid, isDirty } = formState;

    const updatePost = async ({ content, published }) => {
        await updateDoc(postRef, {
            content,
            published,
            updatedAt: serverTimestamp()
        });

        reset({ content, published });

        toast.success('Post updated successfully!');
    };
    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className='card'>
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}
            <div className={preview ? styles.hidden : styles.controls}>
                <ImageUploader />
                <textarea
                    {...register('content', {
                        maxLength: {
                            value: 20000,
                            message: 'Content is too long'
                        },
                        minLength: {
                            value: 10,
                            message: 'Content is too short'
                        },
                        required: {
                            value: true,
                            message: 'Content must not be empty'
                        }
                    })}></textarea>

                {formState.errors && (
                    <p className='text-danger'>
                        {formState.errors.content?.message}
                    </p>
                )}

                <fieldset>
                    <input
                        className={styles.checkbox}
                        {...register('published')}
                        type='checkbox'
                    />
                    <label>Published</label>
                </fieldset>
                <button
                    type='submit'
                    className='btn-green'
                    disabled={!isDirty || !isValid}>
                    Save changes
                </button>
            </div>
        </form>
    );
}

function PostManager() {
    const [preview, setPreview] = useState(false);
    const router = useRouter();
    const { slug } = router.query;
    const postRef = doc(
        firestore,
        `users/${auth.currentUser.uid}/posts/${slug}`
    );

    const [post] = useDocumentData(postRef);
    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm
                            postRef={postRef}
                            defaultValues={post}
                            preview={preview}
                        />
                    </section>
                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>
                            {preview ? 'Edit' : 'Preview'}
                        </button>
                        <Link href={`/${post.username}/${post.slug}`} passHref>
                            <button className='btn-blue'>Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    );
}
