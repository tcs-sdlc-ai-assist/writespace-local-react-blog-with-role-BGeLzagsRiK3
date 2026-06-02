import React from 'react';
import PropTypes from 'prop-types';
import { getAvatar } from './Avatar';
import { getSession } from '../utils/auth';

export function UserRow({ user, onDelete }) {
  const session = getSession();

  const isHardCodedAdmin = user.userId === 'admin';
  const isCurrentUser = session && session.userId === user.userId;
  const canDelete = !isHardCodedAdmin && !isCurrentUser;

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  const roleBadge =
    user.role === 'admin' ? (
      <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
        admin
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
        user
      </span>
    );

  return (
    <>
      {/* Desktop row */}
      <tr className="hidden md:table-row border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {user.displayName}
              </span>
              <span className="text-xs text-gray-400">@{user.username}</span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">{roleBadge}</td>
        <td className="px-6 py-4 text-sm text-gray-500">{formattedDate}</td>
        <td className="px-6 py-4 text-right">
          {canDelete && (
            <button
              onClick={() => onDelete(user.userId)}
              className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          )}
        </td>
      </tr>

      {/* Mobile card */}
      <div className="md:hidden rounded-xl bg-white shadow-sm p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {getAvatar(user.role)}
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium text-gray-900">
              {user.displayName}
            </span>
            <span className="text-xs text-gray-400">@{user.username}</span>
          </div>
          {roleBadge}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{formattedDate}</span>
          {canDelete && (
            <button
              onClick={() => onDelete(user.userId)}
              className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;