## Alumni Platform (Next.js Migration)

Migrated alumni engagement platform frontend (directory, events, donations, mentorship, profile, auth) to Next.js App Router with TypeScript, role-based gating, session-based auth, and API integration to the existing Express backend.

### Features Implemented
- Auth (Google OAuth launch, dev login), session refresh, logout
- Role gating (admin UI hidden unless role is admin/superadmin)
- Alumni private directory + profile editing + per-alumnus admin edit
- Events list / registration / admin creation
- Donations (user list/create, admin list with edit/delete)
- Mentorship requests (create/list)
- Public directory, landing page
- Toast notifications, loading spinners, protected route middleware
 - Theme toggle (class-based dark mode)
 - Debug panels gated by `NEXT_PUBLIC_DEBUG_PANELS=1`

### Prerequisites
- Running backend (Express) on `http://localhost:5000` with routes under `/api/*` and session cookie (e.g. `connect.sid`).
- Environment variables for backend (Google OAuth, DB) set in backend `.env`.
- (Optional) Frontend `.env.local` variables if you need build-time config (add `NEXT_PUBLIC_*`). Currently not required for basic operation.

### Development
```bash
npm install
npm run dev
```
Frontend: http://localhost:3000

Backend must be started separately (in `alumni-platform/backend`).

### Middleware Protection
`middleware.ts` redirects unauthenticated users hitting protected paths (`/profile`, `/donations`, `/mentorship`, `/alumni*`) to `/auth` by checking for a session cookie (`connect.sid`). Adjust cookie name if your backend uses something else.

### Debug Panels
Set `NEXT_PUBLIC_DEBUG_PANELS=1` in `.env.local` to enable raw response panels. Leave unset/0 to hide in production.

### Toasts & UX
A lightweight toast system (`ToastProvider`) and spinners improve feedback. Triggered for major CRUD operations.

### Admin Donation Management
Admins can edit or delete individual donations inline (modal prompts). Backend routes used: `PUT /api/donations/:id`, `DELETE /api/donations/:id`.

### Next Steps / Hardening (Optional)
- Replace prompt() dialogs with proper modal components.
- Add rate limiting / input validation client-side.
- Implement optimistic updates & SWR caching.
- Add testing (Playwright / Jest) for critical flows.

### Environment Variables
Create a `.env.local` (not committed) from `.env.example`.

Core (server / backend consumed)
- `DATABASE_URL` or (`DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASS`, `DB_PORT`)
- `PGSSL` (false/true) – toggles SSL for primary DB when using granular vars.
- `ALUMNI_DATABASE_URL` or alumni granular set (`ALUMNI_DB_USER`, `ALUMNI_DB_HOST`, ...)
- `ALUMNI_PGSSL` – SSL toggle for alumni DB.
- `SESSION_SECRET` (or `JWT_SECRET` fallback) – Express session.
- `ADMIN_EMAILS` – comma list of emails granted admin role.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` – Google OAuth credentials.
- `GOOGLE_CALLBACK_URL` (optional explicit override; usually derived by backend).
- `ALLOWED_ORIGINS` – comma list for CORS (e.g. `http://localhost:3000`).
- `PORT` – backend server port (default 5000).

Frontend (exposed; must be prefixed `NEXT_PUBLIC_`)
- `NEXT_PUBLIC_DEBUG_PANELS` – `1` to show debug JSON panes.
- `NEXT_PUBLIC_API_BASE` – override auto API base detection (optional).

Optional / Operational
- `LOG_LEVEL` – info, warn, error, debug (if backend implements logging levels).

Add any SMTP / third-party keys (email, storage, analytics) only to backend `.env` (never with `NEXT_PUBLIC_` unless truly needed on the client).

Validation Recommendation
Add a lightweight runtime check (e.g. in backend `server.js`) to assert required vars (`DATABASE_URL` or granular, `SESSION_SECRET`, Google OAuth pair in prod) and fail fast if missing.

### License
Internal migration prototype – add appropriate license text if distributing.
