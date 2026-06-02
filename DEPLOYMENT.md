# Deployment Guide

This guide covers deploying the WriteSpace application to **Vercel** (recommended) and general deployment notes.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Configuration](#build-configuration)
- [Deploying to Vercel](#deploying-to-vercel)
- [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Environment Variables](#environment-variables)
- [localStorage Data Notes](#localstorage-data-notes)
- [Other Hosting Providers](#other-hosting-providers)

---

## Prerequisites

- A GitHub, GitLab, or Bitbucket repository containing the WriteSpace project
- A [Vercel](https://vercel.com) account (free tier is sufficient)
- Node.js 18+ installed locally (for local builds and testing)

---

## Build Configuration

WriteSpace uses **Vite** as its build tool. The relevant build details are:

| Setting          | Value         |
| ---------------- | ------------- |
| Build Command    | `vite build`  |
| Output Directory | `dist`        |
| Install Command  | `npm install`  |
| Dev Command      | `vite`        |
| Framework        | Vite          |

To build locally:

```bash
npm install
npm run build
```

The production-ready files will be output to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Deploying to Vercel

### Step 1: Push Your Code

Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### Step 2: Connect Repository to Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **"Add New…"** → **"Project"**.
3. Select your Git provider and authorize Vercel if prompted.
4. Find and select the **writespace** repository from the list.

### Step 3: Configure Project Settings

Vercel will auto-detect the project as a **Vite** application. Verify the following settings on the configuration screen:

- **Framework Preset**: Vite
- **Build Command**: `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

These should be detected automatically. No changes are typically required.

### Step 4: Deploy

1. Click **"Deploy"**.
2. Vercel will install dependencies, run the build, and deploy the application.
3. Once complete, you will receive a production URL (e.g., `https://writespace-xxxxx.vercel.app`).

### Step 5: Verify

Visit the provided URL and confirm:

- The landing page loads at `/`
- Navigation to `/login` and `/register` works without 404 errors
- After logging in, protected routes like `/blogs` and `/write` render correctly
- Refreshing the browser on any route does not produce a 404

---

## SPA Rewrite Configuration

WriteSpace is a single-page application (SPA) using client-side routing via React Router. All routes must be served by `index.html` so that React Router can handle them.

The project includes a `vercel.json` file at the repository root with the following configuration:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This rewrite rule ensures that:

- Any URL path (e.g., `/blogs`, `/blog/some-id`, `/admin/users`) is served by `index.html`
- React Router then reads the URL and renders the correct component
- Direct navigation and browser refreshes on any route work as expected

**Do not remove or modify this file** unless you are migrating away from Vercel or switching to server-side rendering.

---

## Environment Variables

**No environment variables are required.**

WriteSpace is a fully client-side application with no external API calls, no database connections, and no server-side secrets. All data is stored in the browser's `localStorage`.

- There is no `.env` file needed for deployment
- No `VITE_*` environment variables need to be configured in Vercel's project settings
- The hard-coded admin credentials (`admin` / `admin123`) are built into the client-side code

---

## localStorage Data Notes

WriteSpace stores all application data in the browser's `localStorage`. This has important implications for deployment and usage:

### How Data is Stored

| Key                   | Description                        |
| --------------------- | ---------------------------------- |
| `writespace_session`  | Current user session (auth state)  |
| `writespace_posts`    | All blog posts                     |
| `writespace_users`    | All registered user accounts       |

### Important Considerations

- **Data is browser-local**: Each user's data exists only in their own browser. There is no shared database or server-side storage. Two users on different browsers (or devices) will each have their own independent set of posts and users.

- **Data does not sync across devices**: If a user creates posts on their laptop, those posts will not appear on their phone or another computer.

- **Data does not persist across browsers**: Switching from Chrome to Firefox (or using incognito/private mode) starts with a clean slate.

- **Clearing browser data removes all content**: If a user clears their browser's local storage, site data, or cookies, all posts, user accounts, and session data will be permanently deleted.

- **No data migration on redeployment**: Redeploying the application to Vercel does not affect existing user data since it lives in each visitor's browser, not on the server.

- **Storage limits**: Most browsers allow approximately 5–10 MB of localStorage per origin. This is sufficient for typical usage but could be reached with a very large number of posts.

- **The hard-coded admin account** (`admin` / `admin123`) is always available regardless of localStorage state, as it is defined in the application code.

---

## Other Hosting Providers

If deploying to a provider other than Vercel, ensure the following:

1. **Build command**: `npm run build` (which runs `vite build`)
2. **Output directory**: `dist`
3. **SPA fallback**: Configure the hosting provider to serve `index.html` for all routes that do not match a static file. This is equivalent to the rewrite rule in `vercel.json`.

Examples for common providers:

- **Netlify**: Add a `_redirects` file in the `public/` directory with: `/* /index.html 200`
- **GitHub Pages**: Use a 404.html redirect strategy or a deployment tool like `gh-pages` with SPA support
- **Nginx**: Add `try_files $uri $uri/ /index.html;` to the server block
- **Apache**: Add a `.htaccess` file with `FallbackResource /index.html`