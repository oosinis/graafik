# Copilot instructions — Graafik

Purpose: Give AI coding agents the minimal, concrete context they need to be productive in this repository.

Quick start (commands)
- Backend (Windows PowerShell):
  ```powershell
  cd backend
  .\mvnw.cmd spring-boot:run     # run dev server
  .\mvnw.cmd clean package      # build artifact
  .\mvnw.cmd test               # run backend tests
  ```
- Frontend (web-app):
  ```bash
  cd web-app
  npm install
  npm run dev    # Next.js dev server (http://localhost:3000)
  npm run build
  ```

Architecture summary (what to know)
- Frontend: a Next.js + TypeScript app under `web-app/`.
  - Main UI lives in `web-app/app/` (routes / pages).
  - Reusable pieces live in `web-app/components/` and `web-app/components/*` subfolders.
  - API helpers: `web-app/services/httpClient.ts` (uses `NEXT_PUBLIC_API_URL` and `credentials: 'include'`).
  - Auth client: `web-app/lib/auth0.ts` (Auth0 config via env vars).
- Backend: Java Spring Boot app in `backend/`.
  - Typical layered layout: `controller/`, `service/`, `repository/`, `model/`, `config/` under `backend/src/main/java`.
  - Runtime config: `backend/src/main/resources/application.properties` (DB and server settings).

Key, discoverable conventions & patterns (do not invent these)
- Use functional React components + hooks; prefer React Query (where present) over raw `useEffect` for data fetching.
- CSS: Tailwind utilities; avoid inline styles unless necessary.
- HTTP helpers: use `web-app/services/httpClient.ts` for requests so cookies (Auth0 sessions) and headers are handled consistently.
- Backend layering: controllers should be thin. Put business logic in `*Service` classes and DB access in `*Repository`.
- DTOs: backend uses DTOs for request/response instead of returning entities directly.

Environment & secrets
- Do NOT commit secrets. The repository currently contains `backend/src/main/resources/application.properties` with DB credentials — do not reproduce these in generated code.
- Use environment variables for runtime secrets (Auth0, DB credentials, API base URL). Examples used by the code:
  - `NEXT_PUBLIC_API_URL` — frontend -> backend base URL
  - `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_BASE_URL`, `AUTH0_SECRET` — see `web-app/lib/auth0.ts`

Build/test specifics & gotchas
- Backend: use the included wrapper (`mvnw`/`mvnw.cmd`) rather than requiring a system Maven install.
- Frontend: `web-app/package.json` defines `dev`, `build`, `start` but no test script — run lint with `npm run lint`.
- CORS/auth: frontend uses cookies (`credentials: 'include'`) — when changing auth/session behavior, verify cookie domains and `NEXT_PUBLIC_API_URL`.

Inconsistencies to notice
- README in project root lists PostgreSQL as DB but `application.properties` contains a MySQL RDS URL. Treat `backend/src/main/resources/application.properties` as the runtime source of truth and flag discrepancies to maintainers.

How to reply and format patches
- Always include code in fenced blocks with the correct language tag (e.g., ```java, ```tsx). When editing multiple files, list file paths and small rationale.
- Keep changes minimal and follow existing file and naming patterns (do not rename packages or files unless asked).
- Explain non-trivial choices briefly in a one-line comment at top of the patch or in the PR description.

Safety and scope
- Avoid adding secrets or credentials into the repo or generated code. When requested to add configuration samples, prefer `.env.example` content with placeholder values.
- Do not delete or rewrite large sections of existing logic unless the user explicitly asks for a refactor and provides acceptance criteria.

If something is unclear
- Ask for the intended runtime environment (local vs Docker vs cloud) and the maintainer preference for DB (MySQL vs Postgres) before changing DB configs.

Quick references (examples to open)
- `backend/src/main/resources/application.properties` — runtime config (DB, port)
- `web-app/lib/auth0.ts` — Auth0 initialization (env-driven)
- `web-app/services/httpClient.ts` — central frontend HTTP helper
- `web-app/app/` and `web-app/components/` — where to add UI

---
If you'd like, I can also:
- run a quick grep for TODOs and open PRs for small issues, or
- generate an `.env.example` and CI hints (ask which secrets to placeholder).

Please review and tell me which parts to expand or any missing files/flows to document.
