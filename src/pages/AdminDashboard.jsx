import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts, getUsers } from '../utils/storage';
import { StatCard } from '../components/StatCard';
import { getAvatar } from '../components/Avatar';

export function AdminDashboard() {
  const session = getSession();
  const navigate = useNavigate();

  const posts = getPosts();
  const users = getUsers();

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1;
  const userCount = users.filter((u) => u.role === 'user').length;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleDelete = (postId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );
    if (!confirmed) {
      return;
    }

    const updatedPosts = posts.filter((p) => p.id !== postId);
    savePosts(updatedPosts);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold">
            Welcome back, {session ? session.displayName : 'Admin'} 👋
          </h1>
          <p className="mt-2 text-indigo-100">
            Here&apos;s an overview of your WriteSpace platform.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon="📝"
            label="Total Posts"
            value={totalPosts}
            bgColor="bg-indigo-100"
          />
          <StatCard
            icon="👥"
            label="Total Users"
            value={totalUsers}
            bgColor="bg-violet-100"
          />
          <StatCard
            icon="👑"
            label="Admins"
            value={adminCount}
            bgColor="bg-amber-100"
          />
          <StatCard
            icon="📖"
            label="Users"
            value={userCount}
            bgColor="bg-emerald-100"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <Link
            to="/write"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Write New Post
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Manage Users
          </Link>
        </div>

        {/* Recent Posts */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Posts</h2>
          </div>

          {recentPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <span className="text-5xl mb-4 select-none">📝</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md">
                There are no posts on the platform yet. Start by writing the
                first one!
              </p>
              <Link
                to="/write"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Write a Post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentPosts.map((post) => {
                const formattedDate = post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '';

                return (
                  <div
                    key={post.id}
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getAvatar(post.authorId === 'admin' ? 'admin' : 'user')}
                      <div className="flex flex-col min-w-0">
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors truncate"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {post.authorName}
                          </span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-gray-400">
                            {formattedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/edit/${post.id}`}
                        className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;