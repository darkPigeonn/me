# Changelog

## 2026-07-21

- Migrated the static portfolio into a Next.js app while keeping the existing landing page (`public/landing.html`).
- Added admin login (`/admin/login`) with httpOnly session cookie auth (credentials from env).
- Added writings CMS: create / edit / delete / publish posts from `/admin`.
- Added public writings pages at `/tulisan` and `/tulisan/[slug]`.
- Linked **Tulisan** in the landing page navigation (desktop + mobile).
- Posts stored in `data/posts.json` (commit after publishing for production deploys).
