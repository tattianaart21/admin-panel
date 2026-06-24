# AGENTS.md

## Commands

| Command             | Description                |
| ------------------- | -------------------------- |
| `npm run lint`      | ESLint                     |
| `npm run typecheck` | TypeScript check           |
| `npm test`          | Vitest (jsdom environment) |

## Design System

Uses `@salutejs/sdds-platform-ai` (Salute design system) and `@salutejs/plasma-icons`. If there is no available component in the design system check `src/shared/ui` first, then implement new component
using parts from the design system

## Architecture

- **Framework**: React 19 + Rsbuild + TanStack Router
- **Routing**: File-based routes in `src/routes/`. Routes are **auto-generated** by TanStack Router CLI into `routeTree.gen.ts`. Run `npm run generate-routes` before build, or use `npm start` to watch.
- **Entry**: `src/app/index.tsx`
- **Path alias**: `@/` → `src/`
- **API**: the project uses two API endpoints which can be found at `public/config.json`. Use `fetch` + `@tanstack/react-query` for api interaction hooks.

## Gotchas

- Route files in `src/routes/` require codegen before build fails
- Build command includes `generate-routes` step automatically
- Strict TypeScript (`noUnusedLocals`, `noUnusedParameters`)
