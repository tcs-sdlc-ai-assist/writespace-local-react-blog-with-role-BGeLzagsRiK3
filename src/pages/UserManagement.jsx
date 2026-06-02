import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getUsers, saveUsers, getPosts, savePosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import { UserRow } from '../components/UserRow';

export function UserManagement() {
  const session = getSession();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const users = getUsers();

  const allUsers = [
    {
      userId: 'admin',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
      createdAt: null,
    },
    ...users.map((u) => ({
      userId: u.id,
      username: u.username,
      displayName: u.displayName,
      role: u.role,
      createdAt: u.createdAt,
    })),
  ];

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!displayName.trim() || !username.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    if (username.trim() === 'admin') {
      setError('Username already exists.');
      return;
    }

    const currentUsers = getUsers();
    if (currentUsers.some((u) => u.username === username.trim())) {
      setError('Username already exists.');
      return;
    }

    const newUser = {
      id: uuidv4(),
      displayName: displayName.trim(),
      username: username.trim(),
      password: password,
      role: role,
      createdAt: new Date().toISOString(),
    };

    currentUsers.push(newUser);
    saveUsers(currentUsers);

    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setSuccess(`User "${newUser.displayName}" created successfully.`);
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteUser = (userId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user? This action cannot be undone.'
    );
    if (!confirmed) {
      return;
    }

    const currentUsers = getUsers();
    const updatedUsers = currentUsers.filter((u) => u.id !== userId);
    saveUsers(updatedUsers);

    // Also remove posts by this user
    const posts = getPosts();
    const updatedPosts = posts.filter((p) => p.authorId !== userId);
    savePosts(updatedPosts);

    setSuccess('User deleted successfully.');
    setError('');
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="mt-2 text-indigo-100">
            Create new users and manage existing accounts.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Create User Form */}
        <div className="rounded-xl bg-white shadow-sm p-8 mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Create New User
          </h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
              {success}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="displayName"
                  className="text-sm font-medium text-gray-700"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end mt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              All Users ({allUsers.length})
            </h2>
          </div>

          {allUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <span className="text-5xl mb-4 select-none">👥</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No users yet
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                Create your first user using the form above.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <table className="hidden md:table w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <UserRow
                      key={user.userId}
                      user={user}
                      onDelete={handleDeleteUser}
                    />
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden flex flex-col gap-3 p-4">
                {allUsers.map((user) => (
                  <UserRow
                    key={user.userId}
                    user={user}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;