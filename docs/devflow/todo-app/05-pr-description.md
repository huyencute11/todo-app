# feat(todos): add todo web app with add, complete and delete

## Summary
A single-page todo app (Vite + React + TypeScript). Users can add a todo, mark it
complete or active again, and delete it. Todos are saved in `localStorage`, so they
survive a reload, and corrupt or blocked storage falls back to an empty list instead of crashing.

## Context
- Problem: build a simple todo web app where users can add, complete and delete todos (time-boxed, devflow lite mode).
- Decisions from clarification: persist in `localStorage`; frontend only, no backend; Vite + React + TS with Vitest, Testing Library and Playwright.
- Approach: pure state functions (`src/todos.ts`) + a storage module with safe fallback (`src/storage.ts`), wired through a `useTodos` hook into one `App` component. Vanilla JS was considered and rejected: it means more hand-written DOM code and weaker component tests in the same time.

## Acceptance criteria
| AC | Criterion | Test | Result | Evidence |
|----|-----------|------|--------|----------|
| AC-1 | Adding "Buy milk" shows it unchecked and clears the input | `AC-1: adds a todo` (e2e) + unit + component | ✅ | [screenshot](https://github.com/huyencute11/todo-app/blob/f87cd28f150ba4bb9e64d57ed12bdd9d05ea8db0/docs/devflow/todo-app/evidence/AC-1-todo-added.png?raw=true) |
| AC-2 | Blank or whitespace-only input adds nothing | `AC-2: rejects blank title`, `AC-2: does not add a todo for blank input` | ✅ | [test output](https://github.com/huyencute11/todo-app/blob/f87cd28f150ba4bb9e64d57ed12bdd9d05ea8db0/docs/devflow/todo-app/evidence/test-results.txt) |
| AC-3 | Tick → completed; untick → active again | `AC-3: toggles completion` (e2e) + unit | ✅ | [completed](https://github.com/huyencute11/todo-app/blob/f87cd28f150ba4bb9e64d57ed12bdd9d05ea8db0/docs/devflow/todo-app/evidence/AC-3-completed.png?raw=true) · [active again](https://github.com/huyencute11/todo-app/blob/f87cd28f150ba4bb9e64d57ed12bdd9d05ea8db0/docs/devflow/todo-app/evidence/AC-3-active-again.png?raw=true) |
| AC-4 | Deleting "A" from "A, B" leaves only "B" | `AC-4: deletes a todo` (e2e) + unit | ✅ | [screenshot](https://github.com/huyencute11/todo-app/blob/f87cd28f150ba4bb9e64d57ed12bdd9d05ea8db0/docs/devflow/todo-app/evidence/AC-4-deleted.png?raw=true) |
| AC-5 | Todos and their completed state survive a reload | `AC-5: persists across reload` (e2e) + unit | ✅ | [after reload](https://github.com/huyencute11/todo-app/blob/f87cd28f150ba4bb9e64d57ed12bdd9d05ea8db0/docs/devflow/todo-app/evidence/AC-5-after-reload.png?raw=true) |
| AC-6 | Invalid or unreadable saved data → empty state, no crash | `AC-6: falls back…` ×4, `AC-6: shows the empty state…` | ✅ | [test output](https://github.com/huyencute11/todo-app/blob/f87cd28f150ba4bb9e64d57ed12bdd9d05ea8db0/docs/devflow/todo-app/evidence/test-results.txt) |

16/16 unit/component and 4/4 e2e tests pass (Chromium). Lint and typecheck are clean.
An independent acceptance audit found all 6 ACs proven.

## Screenshots
**AC-1 — todo added, input cleared**
![AC-1](https://github.com/huyencute11/todo-app/blob/f87cd28f150ba4bb9e64d57ed12bdd9d05ea8db0/docs/devflow/todo-app/evidence/AC-1-todo-added.png?raw=true)

**AC-3 — completed (struck through)**
![AC-3](https://github.com/huyencute11/todo-app/blob/f87cd28f150ba4bb9e64d57ed12bdd9d05ea8db0/docs/devflow/todo-app/evidence/AC-3-completed.png?raw=true)

**AC-4 — "A" deleted, "B" remains**
![AC-4](https://github.com/huyencute11/todo-app/blob/f87cd28f150ba4bb9e64d57ed12bdd9d05ea8db0/docs/devflow/todo-app/evidence/AC-4-deleted.png?raw=true)

**AC-5 — state kept after reload**
![AC-5](https://github.com/huyencute11/todo-app/blob/f87cd28f150ba4bb9e64d57ed12bdd9d05ea8db0/docs/devflow/todo-app/evidence/AC-5-after-reload.png?raw=true)

## How to test locally
```bash
npm install
npx playwright install chromium   # first time only
npm run dev                       # http://localhost:5173
npm test                          # unit + component
npm run test:e2e                  # Playwright e2e
npm run lint && npm run typecheck
```

## Review notes
- Review findings fixed: 2 Major.
  - R1: Vitest now uses a Node flag that also works on Node 24 LTS; before, the tests could not start there.
  - R2: blocked `localStorage` reads no longer give a blank page.
- Known limitations / follow-ups:
  - One malformed stored item resets the whole list, and the next save overwrites it (R3).
  - No e2e test clicks the Add button (R4).
  - A plain `npm run test:e2e` writes screenshots to `docs/devflow/evidence/`; set `DEVFLOW_EVIDENCE_DIR` to regenerate the committed evidence.
  - `crypto.randomUUID` requires a secure context (localhost or HTTPS).
  - Unused Vite template assets and README; page title is still "scaffold".
  - Only Chromium tested.

## Docs
Full analysis, design, review and verification: `docs/devflow/todo-app/`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
