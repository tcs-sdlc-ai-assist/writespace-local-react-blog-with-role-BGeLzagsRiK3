import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { getSession } from './utils/auth';
import { PublicNavbar } from './components/PublicNavbar';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Home } from './pages/Home';
import { ReadBlog } from './pages/ReadBlog';
import { WriteBlog } from './pages/WriteBlog';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagement } from './pages/UserManagement';

const PUBLIC_PATHS = ['/', '/login', '/register'];

function AppLayout() {
  const location = useLocation();
  const session = getSession();

  const isPublicRoute = PUBLIC_PATHS.includes(location.pathname);

  const showPublicNavbar = isPublicRoute;
  const showNavbar = !isPublicRoute && session;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showPublicNavbar && <PublicNavbar />}
      {showNavbar && <Navbar />}
      <div className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <ProtectedRoute>
                <ReadBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/write"
            element={
              <ProtectedRoute>
                <WriteBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <WriteBlog />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;