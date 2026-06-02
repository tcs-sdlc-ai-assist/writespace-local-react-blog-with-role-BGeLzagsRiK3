import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAvatar } from './Avatar';
import { getSession } from '../utils/auth';

const BORDER_COLORS = [
  'border-t-violet-500',
  'border-t-indigo-500',
  'border-t-blue-500',
  'border-t-emerald-500',
  'border-t-amber-500',
  'border-t-rose-500',
  'border-t-cyan-500',
  'border-t-fuchsia-500',
];

export function BlogCard({ post, index }) {
  const session = getSession();
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

  const excerpt =
    post.content && post.content.length > 120
      ? post.content.slice(0, 120) + '…'
      : post.content || '';

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  return (
    <div
      className={`rounded-xl bg-white shadow-sm border-t-4 ${borderColor} flex flex-col justify-between h-full`}
    >
      <div className="p-6 flex flex-col gap-3 flex-1">
        <Link
          to={`/blog/${post.id}`}
          className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
        >
          {post.title}
        </Link>
        <p className="text-sm text-gray-600 flex-1">{excerpt}</p>
      </div>
      <div className="px-6 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getAvatar(post.authorId === 'admin' ? 'admin' : 'user')}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {post.authorName}
            </span>
            <span className="text-xs text-gray-400">{formattedDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Link
              to={`/blog/${post.id}`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-indigo-600"
              title="Edit post"
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number,
};

BlogCard.defaultProps = {
  index: 0,
};

export default BlogCard;