# KurlyDeer web hub

React/Vite portfolio with an optional Supabase CMS. The repository root owns the npm workspace lockfile. Clave is a Flutter app; its Dart/Firebase dependencies remain in `apps/clave/pubspec.yaml`.

## Install and validate

From the repository root, using Node 24 (the Vercel/CI version):

```sh
npm ci --include=optional
npm run build --workspace=apps/web
npm test --workspace=apps/web
npx playwright install chromium
npm run test:e2e --workspace=apps/web
```

`build` runs TypeScript validation before Vite. `lint` is the existing TypeScript check, not ESLint. Browser tests use a mocked Supabase backend; they do not send real messages or modify a live database. GitHub Actions repeats these checks on Linux. Generated dependencies, bundles and test output are ignored.

To develop: `npm run dev:web` from the root. Copy `.env.example` to `apps/web/.env.local` for local configuration.

## Vercel

Set the project's Root Directory to `apps/web`, with access to files outside that directory enabled for the workspace root. The checked-in configuration installs from the repository root using `npm ci --include=optional`, runs the web build, and publishes `dist`. Use Node 24. Do not override the install command with `npm install`, and do not omit optional dependencies. Preview the feature branch before merging; retrying `dc04283` cannot pick up these fixes.

The original failure occurred because tracked macOS `node_modules` and the incomplete root lockfile left Linux Rollup absent. The root lockfile was regenerated in a clean directory; versions within existing declared ranges were refreshed. Both nested npm lockfiles were removed. Do not commit `node_modules` or `dist` again.

## Enable secure mobile editing

1. Back up the live database and inspect existing content. Apply `supabase/migrations/202610110001_hub_cms.sql` once using the Supabase SQL editor or migration tooling. It creates new `hub_content`/`hub_settings` tables and a `hub-assets` bucket, seeds the six bundled items, and leaves legacy tables untouched. Do not rerun the legacy `schema.sql`; its tables and policies are not used by this editor.
2. Create the intended admin account in Supabase Auth. Assign **app_metadata** `role: "admin"` through a trusted dashboard/Admin API operation. Preserve other metadata. User-editable `user_metadata` is not accepted. Sign out and back in after changing the role. Do not expose service-role keys in this app.
3. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the appropriate Vercel environments, then rebuild. Only the public anon/publishable key belongs in frontend configuration.
4. Sign in at `/login`; use `/admin` to create or edit project cards and articles, save drafts, publish/unpublish, delete with confirmation, and change availability. Public reads only fetch published content. SQL policies independently restrict writes to admins.
5. Verify with a real admin and a non-admin on the preview deployment before promoting. Live Supabase credentials and policies were not changed by this PR.

The editor uses a mobile navigation drawer, native modal dialogs with focus containment/Escape behavior, 44px minimum action controls, 16px inputs, scrollable forms, and cards instead of wide tables. Failed writes preserve input. Timestamp comparisons reject stale updates from a second device; close the editor and reload to resolve a conflict. Uploads accept JPEG/PNG/WebP/PDF up to 5 MB. Assets are **public immediately**, even when attached to drafts. Cancelling an edit or deleting content does not delete uploaded assets; unused assets can be removed through Supabase Storage.

Public pages fall back to bundled content when configuration is missing or the first CMS read fails. After a successful read, failures retain the last loaded content. Focus/reload refreshes changes across devices. This fallback may temporarily show an older bundled item during a backend outage; for strict takedowns, remove it from bundled data too or adopt a server-managed cache with invalidation.

## Contact delivery

Set `VITE_WEB3FORMS_ACCESS_KEY` to enable both contact forms and configure allowed domains in Web3Forms. Without it, sending is disabled. Success requires a successful delivery API response; failures retain text. `/messages` is authenticated **browser-local sent history**, not a shared admin inbox. It does not aggregate messages sent from other visitors' browsers. Use the configured email destination for actual incoming messages.

## Database policy checks

For a **disposable empty PostgreSQL database only**, run:

```sh
psql "$TEST_DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f apps/web/test/schema-bootstrap.sql \
  -f apps/web/supabase/migrations/202610110001_hub_cms.sql \
  -f apps/web/test/schema-policies.sql
```

The bootstrap supplies minimal Supabase auth/storage interfaces. Tests exercise actual PostgreSQL RLS: anonymous draft isolation, admin writes, denial of user_metadata privilege escalation, upload-folder restrictions, and optimistic concurrency. They do not replace testing Supabase Auth and Storage against the real project.

## Follow-up architecture

Keep one workspace lockfile, mandatory Linux CI, and explicit migrations. Admin and Markdown-heavy routes are loaded separately from the homepage. Move contact history to a server-side inbox if cross-device inbox management is required. Prefer a server cache with explicit publication invalidation over loading content during builds; that keeps a CMS outage from blocking Vercel builds. Clave's external subdomain and Flutter routes require a separate live deployment check; this change does not rebuild or deploy Flutter.
