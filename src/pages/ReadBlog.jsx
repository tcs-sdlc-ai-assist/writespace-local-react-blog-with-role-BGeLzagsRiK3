import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPosts, savePosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import { getAvatar } from '../components/Avatar';

export function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const posts = getPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white shadow-sm p-12 text-center">
          <span className="text-5xl mb-4 select-none">🔍</span>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Post not found
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md">
            The post you&apos;re looking for doesn&apos;t exist or may have been
            removed.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  const isAdmin = session && session.role === 'admin';
  const isOwner = session && session.userId === post.authorId;
  const canEditDelete = isAdmin || isOwner;

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );
    if (!confirmed) {
      return;
    }

    const updatedPosts = posts.filter((p) => p.id !== post.id);
    savePosts(updatedPosts);
    navigate('/blogs');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blogs
        </Link>
      </div>

      <article className="rounded-xl bg-white shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {getAvatar(post.authorId === 'admin' ? 'admin' : 'user')}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                {post.authorName}
              </span>
              <span className="text-xs text-gray-400">{formattedDate}</span>
            </div>
          </div>

          {canEditDelete && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit/${post.id}`}
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="prose prose-gray max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </article>
    </div>
  );
}

export default ReadBlog;