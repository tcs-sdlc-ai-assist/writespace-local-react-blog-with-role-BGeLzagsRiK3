# WriteSpace

A local role-based blog platform built with React, Vite, and Tailwind CSS. WriteSpace provides a clean, distraction-free writing experience with role-based access control, user management, and instant publishing — all powered by the browser's localStorage.

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| [React 18](https://react.dev/) | UI library |
| [Vite 5](https://vitejs.dev/) | Build tool and dev server |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first CSS framework |
| [React Router 6](https://reactrouter.com/) | Client-side routing |
| [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) | Client-side data persistence |
| [Vitest](https://vitest.dev/) | Unit and integration testing |
| [Testing Library](https://testing-library.com/) | React component testing utilities |

---

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel SPA rewrite rules
├── CHANGELOG.md                # Project changelog
├── DEPLOYMENT.md               # Deployment guide
├── README.md                   # Project documentation (this file)
├── public/
│   └── vite.svg                # Favicon
└── src/
    ├── main.jsx                # Application entry point
    ├── App.jsx                 # Root component with routing
    ├── App.test.jsx            # Integration tests for routing
    ├── index.css               # Tailwind CSS imports
    ├── setupTests.js           # Test setup (jest-dom)
    ├── components/
    │   ├── Avatar.jsx          # Role-based avatar display
    │   ├── BlogCard.jsx        # Blog post card component
    │   ├── Navbar.jsx          # Authenticated navigation bar
    │   ├── ProtectedRoute.jsx  # Route guard for auth and roles
    │   ├── PublicNavbar.jsx    # Public navigation bar
    │   ├── StatCard.jsx        # Dashboard statistic card
    │   └── UserRow.jsx         # User list row (desktop + mobile)
    ├── pages/
    │   ├── AdminDashboard.jsx  # Admin overview dashboard
    │   ├── Home.jsx            # Blog listing page
    │   ├── LandingPage.jsx     # Public landing page
    │   ├── LoginPage.jsx       # Login form
    │   ├── ReadBlog.jsx        # Single blog post view
    │   ├── RegisterPage.jsx    # Registration form
    │   ├── UserManagement.jsx  # Admin user management
    │   └── WriteBlog.jsx       # Create/edit blog post
    └── utils/
        ├── auth.js             # Session management utilities
        ├── auth.test.js        # Auth utility tests
        ├── storage.js          # localStorage read/write utilities
        └── storage.test.js     # Storage utility tests
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm (included with Node.js)

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Default Admin Credentials

WriteSpace ships with a hard-coded admin account for initial access:

| Field | Value |
| --- | --- |
| Username | `admin` |
| Password | `admin123` |

---

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `vite` | Start the development server with hot module replacement |
| `npm run build` | `vite build` | Build the application for production into the `dist/` directory |
| `npm run preview` | `vite preview` | Preview the production build locally |
| `npm test` | `vitest` | Run the test suite in watch mode |

---

## Features

- **Public Landing Page** — Hero section, feature highlights, latest posts preview, and footer with navigation links
- **User Authentication** — Login and registration with session management via localStorage
- **Role-Based Access Control** — Admin and user roles with route-level protection
- **Blog CRUD** — Create, read, edit, and delete blog posts with ownership checks
- **Admin Dashboard** — Platform statistics, recent posts, and quick action links
- **User Management** — Admin-only interface to create and delete user accounts
- **Avatar System** — Role-based emoji avatars (👑 for admins, 📖 for users)
- **Responsive Navigation** — Separate navbars for public and authenticated routes with mobile hamburger menu
- **Blog Cards** — Rotating border colors, content excerpts, author info, and edit icons
- **Responsive Design** — Mobile-first layout using Tailwind CSS utility classes
- **localStorage Persistence** — All data stored client-side with graceful error handling

---

## Route Table

### Public Routes

| Path | Component | Description |
| --- | --- | --- |
| `/` | `LandingPage` | Public landing page with hero and features |
| `/login` | `LoginPage` | User login form |
| `/register` | `RegisterPage` | User registration form |

### Protected Routes (Authenticated Users)

| Path | Component | Description |
| --- | --- | --- |
| `/blogs` | `Home` | Blog listing page (all posts) |
| `/blog/:id` | `ReadBlog` | Single blog post view |
| `/write` | `WriteBlog` | Create a new blog post |
| `/edit/:id` | `WriteBlog` | Edit an existing blog post |

### Admin-Only Routes

| Path | Component | Description |
| --- | --- | --- |
| `/admin` | `AdminDashboard` | Admin overview with statistics |
| `/admin/users` | `UserManagement` | Create and manage user accounts |

### Route Guards

- Unauthenticated users accessing protected routes are redirected to `/login`
- Non-admin users accessing admin routes are redirected to `/blogs`
- Authenticated users accessing `/login` or `/register` are redirected to their dashboard

---

## localStorage Schema

All application data is stored in the browser's localStorage under the following keys:

### `writespace_session`

Stores the current user's session.

```json
{
  "userId": "string",
  "username": "string",
  "displayName": "string",
  "role": "admin | user"
}
```

### `writespace_posts`

Stores all blog posts as a JSON array.

```json
[
  {
    "id": "string (UUID)",
    "title": "string",
    "content": "string",
    "authorId": "string",
    "authorName": "string",
    "createdAt": "string (ISO 8601)"
  }
]
```

### `writespace_users`

Stores all registered user accounts as a JSON array.

```json
[
  {
    "id": "string (UUID)",
    "displayName": "string",
    "username": "string",
    "password": "string",
    "role": "admin | user",
    "createdAt": "string (ISO 8601)"
  }
]
```

### Important Notes

- Data is **browser-local** — each browser maintains its own independent data
- Data does **not sync** across devices or browsers
- Clearing browser storage **permanently deletes** all content
- The hard-coded admin account (`admin` / `admin123`) is always available regardless of localStorage state
- Most browsers allow approximately 5–10 MB of localStorage per origin

---

## Deployment

WriteSpace is configured for deployment on [Vercel](https://vercel.com). The included `vercel.json` provides SPA rewrite rules so that all routes are served by `index.html`.

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy

1. Push the repository to GitHub, GitLab, or Bitbucket
2. Import the project in [Vercel](https://vercel.com)
3. Vercel auto-detects Vite — no configuration changes needed
4. Click **Deploy**

No environment variables are required. WriteSpace is a fully client-side application.

---

## License

This project is private and proprietary.