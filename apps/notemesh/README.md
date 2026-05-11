# NoteMesh MVP

NoteMesh is a fast, markdown-first note-taking web app focused on quick capture, editing, search, and tag-based organization.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + SQLite
- Cookie session auth (email/password)
- Markdown editor + live preview (`react-markdown`)
- Zustand, Sonner, CmdK

## Features in this MVP

- Authentication (register/login/logout/forgot-password placeholder)
- Protected note app routes
- Notes CRUD with autosave
- Pin, archive, trash restore, hard delete
- Markdown editing with edit/preview/split modes and toolbar snippets
- Full-text search endpoint + tag filtering
- Theme toggle with persistence
- Shared read-only notes via tokenized links
- Seed demo data
- Docker self-hosting setup

## Project structure

- `src/app/(auth)` auth pages
- `src/app/(app)` authenticated pages (notes, tags, archive, trash, settings)
- `src/app/api` route handlers
- `src/components` reusable UI/layout/editor/notes/command components
- `src/lib` auth/db/search/validators/utilities
- `src/server` repositories and services
- `src/store` Zustand stores
- `prisma` schema and seed
- `public/uploads` attachment storage target

## Local setup

```bash
cp .env.example .env
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Open http://localhost:3000

Demo account defaults:
- Email: `demo@notemesh.app`
- Password: `demopassword`

## Useful commands

```bash
npm run lint
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Docker

```bash
cp .env.example .env
docker compose up --build
```

The app runs at http://localhost:3000.

## API overview

- Auth: `POST /api/auth/register|login|logout|forgot-password`
- Notes: `GET/POST /api/notes`, `GET/PATCH/DELETE/PUT /api/notes/:id`
- Note actions: `POST /api/notes/:id/duplicate|pin|archive|restore`
- Search: `GET /api/search?q=...&tag=...&sort=...`
- Tags: `GET/POST /api/tags`, `PATCH/DELETE /api/tags/:id`
- Trash/Archive: `GET /api/trash`, `GET /api/archive`, `DELETE /api/trash/:id`
- Attachments: `POST /api/notes/:id/attachments`, `DELETE /api/attachments/:id`
- Share: `POST /api/notes/:id/share`, `DELETE /api/share/:id`, `GET /api/shared/:token`
- Settings: `GET/PATCH /api/settings`

## Notes

- This MVP keeps architecture simple for self-hosting and future expansion.
- Forgot password route is intentionally a non-email placeholder for now.
