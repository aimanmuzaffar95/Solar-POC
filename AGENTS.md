# AGENTS

## Project Architecture

This project uses a frontend-only architecture built with Vite + React + TypeScript. Currently this project is just UI with static data and does not have any backend connected.

- Runtime: Client-side SPA (no backend server in this repository).
- Build tool: Vite.
- UI stack: React 18, Tailwind CSS, shadcn/ui (Radix-based components).
- Routing: `react-router-dom` with route definitions in `src/App.tsx`.
- State management: `AuthContext` (`src/context/AuthContext.tsx`) manages user session state.
- State management: `AppContext` (`src/context/AppContext.tsx`) manages domain data and business actions.
- Data source: Seed/mock data from `src/data/seedData.ts` (in-memory state, no persistent DB).
- API integration pattern: Frontend can call external backend APIs via env-based config (for example `VITE_API_BASE_URL`).
- Notifications/UX infra: React Query provider, toaster/sonner, tooltip provider initialized in `src/App.tsx`.

## Deployment Note

Deploy this app as a static frontend. Any production API or database should be hosted separately (for example a NestJS service) and accessed from this frontend using environment variables.

## Test Policy

- Do not create test files in this repository.
- Do not run test commands for routine tasks.
- Prioritize implementation speed and token efficiency over test generation.
