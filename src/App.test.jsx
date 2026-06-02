import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicNavbar } from './components/PublicNavbar';
import { Navbar } from './components/Navbar';

vi.mock('./utils/storage', () => ({
  getPosts: vi.fn(() => []),
  savePosts: vi.fn(),
  getUsers: vi.fn(() => []),
  saveUsers: vi.fn(),
}));

const SESSION_KEY = 'writespace_session';

function setMockSession(session) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

const adminSession = {
  userId: 'admin',
  username: 'admin',
  displayName: 'Admin',
  role: 'admin',
};

const userSession = {
  userId: 'user1',
  username: 'alice',
  displayName: 'Alice',
  role: 'user',
};

function TestApp({ initialEntries }) {
  const { getSession } = require('./utils/auth');
  const session = getSession();

  const PUBLIC_PATHS = ['/', '/login', '/register'];
  const currentPath = initialEntries[initialEntries.length - 1];
  const isPublicRoute = PUBLIC_PATHS.includes(currentPath);

  const showPublicNavbar = isPublicRoute;
  const showNavbar = !isPublicRoute && session;

  return (
    <MemoryRouter initialEntries={initialEntries}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {showPublicNavbar && <PublicNavbar />}
        {showNavbar && <Navbar />}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<div data-testid="landing-page">Landing Page</div>} />
            <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            <Route path="/register" element={<div data-testid="register-page">Register Page</div>} />
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <div data-testid="home-page">Home Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/:id"
              element={
                <ProtectedRoute>
                  <div data-testid="read-blog-page">Read Blog Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/write"
              element={
                <ProtectedRoute>
                  <div data-testid="write-blog-page">Write Blog Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <div data-testid="edit-blog-page">Edit Blog Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <div data-testid="admin-dashboard-page">Admin Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute role="admin">
                  <div data-testid="user-management-page">User Management</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </MemoryRouter>
  );
}

describe('App routing', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('public routes', () => {
    it('renders the landing page at /', () => {
      setMockSession(null);
      render(<TestApp initialEntries={['/']} />);
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });

    it('renders the login page at /login', () => {
      setMockSession(null);
      render(<TestApp initialEntries={['/login']} />);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('renders the register page at /register', () => {
      setMockSession(null);
      render(<TestApp initialEntries={['/register']} />);
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });

    it('shows the public navbar on public routes', () => {
      setMockSession(null);
      render(<TestApp initialEntries={['/']} />);
      expect(screen.getByText('WriteSpace')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('shows public navbar with dashboard link when user is logged in on public route', () => {
      setMockSession(userSession);
      render(<TestApp initialEntries={['/']} />);
      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    });
  });

  describe('protected routes redirect unauthenticated users to /login', () => {
    it('redirects /blogs to /login when not authenticated', () => {
      setMockSession(null);
      render(<TestApp initialEntries={['/blogs']} />);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
    });

    it('redirects /blog/:id to /login when not authenticated', () => {
      setMockSession(null);
      render(<TestApp initialEntries={['/blog/some-id']} />);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('read-blog-page')).not.toBeInTheDocument();
    });

    it('redirects /write to /login when not authenticated', () => {
      setMockSession(null);
      render(<TestApp initialEntries={['/write']} />);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('write-blog-page')).not.toBeInTheDocument();
    });

    it('redirects /edit/:id to /login when not authenticated', () => {
      setMockSession(null);
      render(<TestApp initialEntries={['/edit/some-id']} />);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('edit-blog-page')).not.toBeInTheDocument();
    });

    it('redirects /admin to /login when not authenticated', () => {
      setMockSession(null);
      render(<TestApp initialEntries={['/admin']} />);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-dashboard-page')).not.toBeInTheDocument();
    });

    it('redirects /admin/users to /login when not authenticated', () => {
      setMockSession(null);
      render(<TestApp initialEntries={['/admin/users']} />);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('user-management-page')).not.toBeInTheDocument();
    });
  });

  describe('protected routes render for authenticated users', () => {
    it('renders /blogs for authenticated user', () => {
      setMockSession(userSession);
      render(<TestApp initialEntries={['/blogs']} />);
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('renders /blog/:id for authenticated user', () => {
      setMockSession(userSession);
      render(<TestApp initialEntries={['/blog/test-id']} />);
      expect(screen.getByTestId('read-blog-page')).toBeInTheDocument();
    });

    it('renders /write for authenticated user', () => {
      setMockSession(userSession);
      render(<TestApp initialEntries={['/write']} />);
      expect(screen.getByTestId('write-blog-page')).toBeInTheDocument();
    });

    it('renders /edit/:id for authenticated user', () => {
      setMockSession(userSession);
      render(<TestApp initialEntries={['/edit/test-id']} />);
      expect(screen.getByTestId('edit-blog-page')).toBeInTheDocument();
    });
  });

  describe('admin routes redirect non-admin users to /blogs', () => {
    it('redirects /admin to /blogs for regular user', () => {
      setMockSession(userSession);
      render(<TestApp initialEntries={['/admin']} />);
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-dashboard-page')).not.toBeInTheDocument();
    });

    it('redirects /admin/users to /blogs for regular user', () => {
      setMockSession(userSession);
      render(<TestApp initialEntries={['/admin/users']} />);
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('user-management-page')).not.toBeInTheDocument();
    });
  });

  describe('admin routes render for admin users', () => {
    it('renders /admin for admin user', () => {
      setMockSession(adminSession);
      render(<TestApp initialEntries={['/admin']} />);
      expect(screen.getByTestId('admin-dashboard-page')).toBeInTheDocument();
    });

    it('renders /admin/users for admin user', () => {
      setMockSession(adminSession);
      render(<TestApp initialEntries={['/admin/users']} />);
      expect(screen.getByTestId('user-management-page')).toBeInTheDocument();
    });

    it('admin can also access regular protected routes', () => {
      setMockSession(adminSession);
      render(<TestApp initialEntries={['/blogs']} />);
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  describe('navbar visibility', () => {
    it('shows authenticated navbar on protected routes for logged-in user', () => {
      setMockSession(userSession);
      render(<TestApp initialEntries={['/blogs']} />);
      expect(screen.getByText('All Blogs')).toBeInTheDocument();
      expect(screen.getByText('Write')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('shows Users link in navbar for admin users', () => {
      setMockSession(adminSession);
      render(<TestApp initialEntries={['/blogs']} />);
      expect(screen.getByText('Users')).toBeInTheDocument();
    });

    it('does not show Users link in navbar for regular users', () => {
      setMockSession(userSession);
      render(<TestApp initialEntries={['/blogs']} />);
      expect(screen.queryByText('Users')).not.toBeInTheDocument();
    });

    it('does not show authenticated navbar on public routes', () => {
      setMockSession(null);
      render(<TestApp initialEntries={['/']} />);
      expect(screen.queryByText('All Blogs')).not.toBeInTheDocument();
      expect(screen.queryByText('Write')).not.toBeInTheDocument();
    });
  });
});