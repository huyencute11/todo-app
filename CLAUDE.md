# todo-app

A single-page todo app: add, complete and delete todos. Frontend only; todos are
persisted in the browser's `localStorage`. Built with the devflow workflow.

## Stack
- React 19 + TypeScript, built with Vite
- Unit/component tests: Vitest (jsdom) + Testing Library
- E2E tests: Playwright (Chromium)
- Lint: oxlint

## Commands
```sh
npm install              # install dependencies
npm run dev              # dev server on http://localhost:5173
npm test                 # unit + component tests (Vitest, single run)
npm run test:e2e         # Playwright e2e (starts the dev server itself)
npm run lint             # oxlint
npm run typecheck        # tsc -b
npm run build            # typecheck + production build
```
First-time e2e setup: `npx playwright install chromium`.

## Conventions
- Pure state logic in `src/todos.ts`; side effects (storage) in `src/storage.ts`;
  React wiring in hooks (`src/useTodos.ts`) and components.
- Unit tests sit next to the code as `src/<name>.test.ts(x)`; e2e specs in `e2e/`.
- Test names start with the acceptance criterion they cover, e.g. `"AC-1: ..."`.
- Query the UI by role/label in tests, not by CSS class.

## Do not
- Edit `package-lock.json` by hand.
- Commit `node_modules`, `dist`, `test-results`, or `playwright-report`.
- Commit to `main` directly; work on `feat/...` / `fix/...` branches.

Task docs live in `docs/devflow/<slug>/`.
