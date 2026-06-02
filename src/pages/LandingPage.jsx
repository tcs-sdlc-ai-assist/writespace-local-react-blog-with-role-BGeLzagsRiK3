import React from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import { BlogCard } from '../components/BlogCard';

export function LandingPage() {
  const posts = getPosts();
  const session = getSession();

  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const features = [
    {
      icon: '✍️',
      title: 'Easy Writing',
      description:
        'A clean, distraction-free writing experience. Just open the editor and start creating your next masterpiece.',
      bgColor: 'bg-indigo-100',
    },
    {
      icon: '🔐',
      title: 'Role-Based Access',
      description:
        'Admins manage users and content. Writers focus on what they do best — writing and sharing ideas.',
      bgColor: 'bg-violet-100',
    },
    {
      icon: '🚀',
      title: 'Instant Publishing',
      description:
        'Publish your posts instantly. No waiting, no approval queues — your words go live the moment you hit publish.',
      bgColor: 'bg-emerald-100',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
            Your Space to Write, Share, and Inspire
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-indigo-100 max-w-2xl">
            WriteSpace is a simple, beautiful platform for writers to share their
            thoughts with the world. Start writing today — no setup required.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">
              Why WriteSpace?
            </h2>
            <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
              Everything you need to start sharing your ideas with the world.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl bg-white p-8 shadow-sm flex flex-col items-center text-center gap-4"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-lg text-2xl select-none ${feature.bgColor}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      {latestPosts.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-gray-900">
                Latest Posts
              </h2>
              <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
                Check out what our community has been writing about.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post, index) =>
                session ? (
                  <BlogCard key={post.id} post={post} index={index} />
                ) : (
                  <div key={post.id} className="relative">
                    <div className="pointer-events-none">
                      <BlogCard post={post} index={index} />
                    </div>
                    <Link
                      to="/login"
                      className="absolute inset-0 z-10"
                      aria-label={`Login to read ${post.title}`}
                    />
                  </div>
                )
              )}
            </div>
            {!session && (
              <div className="mt-10 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Login to Read More
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-lg font-bold text-white">WriteSpace</span>
              <span className="text-sm">
                Your space to write, share, and inspire.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm hover:text-white transition-colors"
              >
                Register
              </Link>
              <Link
                to="/blogs"
                className="text-sm hover:text-white transition-colors"
              >
                Blogs
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm">
            &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;