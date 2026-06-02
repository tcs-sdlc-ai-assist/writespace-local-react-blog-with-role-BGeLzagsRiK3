import React from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { BlogCard } from '../components/BlogCard';

export function Home() {
  const posts = getPosts();

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Blogs</h1>
        <Link
          to="/write"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Write a Post
        </Link>
      </div>

      {sortedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white shadow-sm p-12 text-center">
          <span className="text-5xl mb-4 select-none">📝</span>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No posts yet
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md">
            It looks like no one has written anything yet. Be the first to share
            your thoughts with the community!
          </p>
          <Link
            to="/write"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Start Writing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;