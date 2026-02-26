# SKILLS

## Architecture Knowledge

When working in this repository, assume the following architecture:

- This is a frontend-only Vite React TypeScript SPA.
- Route-level composition is handled in `src/App.tsx`.
- Authentication state lives in `src/context/AuthContext.tsx`.
- Application/domain state lives in `src/context/AppContext.tsx`.
- Data is currently mock/seed based from `src/data/seedData.ts`.
- UI layer uses Tailwind CSS + shadcn/ui components under `src/components/ui`.
- API requests are expected to target an external backend service via env config (`VITE_*` variables).
- The repository does not include a production backend runtime or database layer.

## Implementation Guidance

- Keep frontend concerns in this repo (UI, routing, client state, API clients).
- Keep backend concerns in a separate service (for example NestJS) for auth, persistence, and business APIs.
- Use environment variables for all deploy-time endpoints and flags.

## Token Efficiency Policy

- Do not add or maintain automated tests in this repository.
- Do not run test suites as part of normal task execution.
- Focus changes on feature implementation and essential validation only.
