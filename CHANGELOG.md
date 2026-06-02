# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

- **Public Landing Page** — Hero section with call-to-action, feature highlights (Easy Writing, Role-Based Access, Instant Publishing), latest posts preview, and a responsive footer with navigation links.
- **User Authentication**
  - Login page with username/password form and validation.
  - Registration page with display name, username, password, and confirm password fields.
  - Hard-coded admin credentials (`admin` / `admin123`) for initial platform access.
  - Session management via `localStorage` with `getSession`, `setSession`, and `clearSession` utilities.
  - Automatic redirect for authenticated users away from login/register pages.
- **Role-Based Route Guards**
  - `ProtectedRoute` component that redirects unauthenticated users to `/login`.
  - Admin-only route protection that redirects non-admin users to `/blogs`.
  - Public routes (`/`, `/login`, `/register`) accessible without authentication.
- **Blog CRUD with Ownership Checks**
  - Create new blog posts with title and content fields, including client-side validation.
  - Read individual blog posts with full content display, author info, and formatted dates.
  - Edit existing posts (restricted to post author or admin users).
  - Delete posts with confirmation dialog (restricted to post author or admin users).
  - Blog listing page with sorted posts (newest first) and empty state messaging.
- **Admin Dashboard**
  - Overview statistics: total posts, total users, admin count, and user count.
  - `StatCard` component for displaying platform metrics with icons and color-coded backgrounds.
  - Recent posts list with quick edit and delete actions.
  - Quick action links to write new posts and manage users.
- **User Management** (Admin Only)
  - Create new users with display name, username, password, and role selection (user/admin).
  - User listing with desktop table and mobile card layouts.
  - Delete users with confirmation dialog (cascading deletion of user posts).
  - Protection against deleting the hard-coded admin account or the currently logged-in user.
  - `UserRow` component with responsive desktop/mobile rendering.
- **Avatar System**
  - Role-based avatar display: crown emoji (👑) for admins, book emoji (📖) for regular users.
  - Consistent avatar styling with Tailwind utility classes across all components.
- **Navigation**
  - `PublicNavbar` for public routes with login/register links, or dashboard link when authenticated.
  - `Navbar` for authenticated routes with links to All Blogs, Write, and Users (admin only).
  - User dropdown menu with avatar, display name, and logout action.
  - Mobile-responsive hamburger menu with collapsible navigation.
- **Blog Cards**
  - `BlogCard` component with rotating top border colors, content excerpts, author info, and edit icons.
  - Linked titles for navigation to full post view.
- **localStorage Persistence**
  - `getPosts` / `savePosts` for blog post storage under `writespace_posts` key.
  - `getUsers` / `saveUsers` for user account storage under `writespace_users` key.
  - Graceful error handling for corrupted data and localStorage unavailability.
- **Responsive Tailwind UI**
  - Fully responsive layout using Tailwind CSS utility classes.
  - Mobile-first design with `sm:`, `md:`, and `lg:` breakpoint prefixes.
  - Gradient hero sections, card-based layouts, and consistent spacing throughout.
- **Vercel SPA Deployment**
  - `vercel.json` configured with SPA rewrite rules for client-side routing support.
- **Testing**
  - Unit tests for `auth` utilities (`getSession`, `setSession`, `clearSession`).
  - Unit tests for `storage` utilities (`getPosts`, `savePosts`, `getUsers`, `saveUsers`).
  - Integration tests for application routing, including public routes, protected routes, admin routes, and navbar visibility.
  - Test setup with Vitest, jsdom, and `@testing-library/react`.