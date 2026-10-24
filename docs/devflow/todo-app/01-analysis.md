# Analysis + design: Todo web app (lite)

## Problem restatement
A user wants a small single-page web app to keep a todo list: add a todo, mark it
complete (and undo that), and delete it. The goal is a working, tested app built
through a visible, disciplined process within a time-boxed session.

## Context found in the codebase
- Greenfield: `/Volumes/DATA/interview/todo-app` is a new, empty git repo.
- No existing patterns or tests; conventions are set by this design.
- Tooling available: Node 25.2.1, npm 11.6.2. `gh` CLI is **not** installed.

## Scope
- In scope: add, toggle complete, delete, list display, empty-state message,
  input validation, persistence across page reload (if Q1 accepted).
- Out of scope / follow-up: editing todo text, filters (all/active/done),
  "clear completed", drag-and-drop ordering, due dates, auth, backend/multi-device sync.

## Assumptions
- A1: Single user, single browser; no accounts.
- A2: Todos are shown in the order they were added (oldest first).
- A3: Leading/trailing whitespace is trimmed; a blank title is rejected.
- A4: Delete is immediate, with no confirmation dialog.

## Edge cases and risks
- E1: Empty or whitespace-only input — would create blank todos; reject it.
- E2: Very long text — could break layout; wrap text with CSS, no hard limit.
- E3: Corrupt or missing localStorage data — app could crash on load; fall back to an empty list.
- E4: Duplicate titles — allowed; each todo has a unique id, so actions never hit the wrong item.
- R1: `gh` not installed — ship phase cannot open a PR; install `gh` or stop at a pushed branch / local commits.
- R2: Time box — scaffold plus test tooling eats time; use Vite's template and keep deps minimal.

## Clarifying questions
| # | Question | Why it matters | Proposed default |
|---|----------|----------------|------------------|
| Q1 | Should todos survive a page reload? | Decides whether we need storage and a load/save path. | Yes, via browser `localStorage`. A list that disappears on refresh isn't useful, and this needs no backend. |
| Q2 | Is a frontend-only app OK, or do you want a backend API? | A backend roughly doubles the work and the test surface. | Frontend only. It fits the time box; a storage module keeps a later API swap easy. |
| Q3 | Stack and dependencies: OK to scaffold Vite + React + TypeScript, plus Vitest + Testing Library for unit tests and Playwright for e2e? | Adds dev dependencies, which you asked me to confirm. | Yes. Vite's scaffold is the fastest start, Vitest shares its config, and Playwright supplies the screenshot evidence for verify. |
| Q4 | Shipping: there's no remote and no `gh`. Where should the result end up? | Decides what the ship phase does. | Local commits on a `feat/todo-app` branch plus `05-pr-description.md` ready to paste; push only if you add a remote. |

## Design (proposed, depends on defaults)

### Approach
A Vite + React + TypeScript single-page app. State lives in one `useTodos` hook
built on pure functions (`addTodo`, `toggleTodo`, `deleteTodo`) that are easy to
unit test. A small `storage` module reads and writes the list as JSON in
`localStorage` under key `todos`, and returns `[]` on missing or invalid data.
The UI is one `App` component: a form (text input + Add button) and a list
where each item has a checkbox and a Delete button.

#### Alternative considered
- Vanilla JS without a framework: fewer deps, but more hand-written DOM code and
  weaker component testing in the same time.

### Changes
| File | New/Modified | Responsibility |
|------|--------------|----------------|
| `src/todos.ts` | New | `Todo` type and pure add/toggle/delete functions |
| `src/storage.ts` | New | `loadTodos()` / `saveTodos()` with safe fallback |
| `src/useTodos.ts` | New | React hook wiring state + persistence |
| `src/App.tsx` | Modified (scaffold) | Form, list, empty state |
| `src/*.test.ts(x)` | New | Vitest unit/component tests |
| `e2e/todos.spec.ts` | New | Playwright e2e with screenshots |

### Contracts
```ts
type Todo = { id: string; title: string; completed: boolean; createdAt: number };
addTodo(list: Todo[], title: string): Todo[]   // trims; returns list unchanged if blank
toggleTodo(list: Todo[], id: string): Todo[]
deleteTodo(list: Todo[], id: string): Todo[]
loadTodos(): Todo[]            // [] on missing/invalid JSON
saveTodos(list: Todo[]): void
```
UI states: empty ("No todos yet"), list with active and completed items
(completed items shown with strike-through and a checked box).

### Acceptance criteria
- **AC-1** [e2e] — Given an empty list, When I type "Buy milk" and press Enter (or click Add), Then "Buy milk" appears in the list unchecked and the input is cleared.
- **AC-2** [unit] — Given the input is empty or only spaces, When I submit, Then no todo is added.
- **AC-3** [e2e] — Given a todo "Buy milk", When I tick its checkbox, Then it is shown as completed; When I untick it, Then it is active again.
- **AC-4** [e2e] — Given todos "A" and "B", When I click Delete on "A", Then only "B" remains.
- **AC-5** [e2e] — Given I added and completed todos, When I reload the page, Then the same todos and their completed states are shown. *(depends on Q1)*
- **AC-6** [unit] — Given `localStorage` holds invalid JSON under `todos`, When the app loads, Then it shows the empty state without crashing.

Out of scope / follow-up: editing, filters, clear completed, ordering, accessibility audit beyond labelled controls.

### Test plan
| AC | Level | Test file | Test name |
|----|-------|-----------|-----------|
| AC-1 | e2e (+unit) | `e2e/todos.spec.ts`, `src/todos.test.ts` | "AC-1: adds a todo" |
| AC-2 | unit | `src/todos.test.ts`, `src/App.test.tsx` | "AC-2: rejects blank titles" |
| AC-3 | e2e (+unit) | `e2e/todos.spec.ts`, `src/todos.test.ts` | "AC-3: toggles completion" |
| AC-4 | e2e (+unit) | `e2e/todos.spec.ts`, `src/todos.test.ts` | "AC-4: deletes a todo" |
| AC-5 | e2e | `e2e/todos.spec.ts` | "AC-5: persists across reload" |
| AC-6 | unit | `src/storage.test.ts` | "AC-6: falls back on invalid data" |

Lite-mode evidence: screenshots for the happy path (AC-1, AC-3, AC-4) and one edge case (AC-5 reload).

### Task breakdown
1. Scaffold Vite React TS, add Vitest + Testing Library + Playwright; write `CLAUDE.md` (setup).
2. Failing unit tests for `todos.ts` and `storage.ts` (AC-2, AC-6, logic of AC-1/3/4) → implement.
3. `useTodos` + `App` UI → component test for AC-2.
4. Playwright e2e for AC-1, AC-3, AC-4, AC-5.

## Answers
Defaults accepted for all four:
- Q1 → Persist in `localStorage` (AC-5, AC-6 stay in scope).
- Q2 → Frontend only.
- Q3 → Vite + React + TS; dev deps Vitest, Testing Library, Playwright approved.
- Q4 → Local commits on `feat/todo-app` + `05-pr-description.md`; no push.

## Decision log
- 2026-10-24 10:41: Repo location set to a new folder `/Volumes/DATA/interview/todo-app` (user choice; keeps the plugin repo clean).
- 2026-10-24 10:43: Q1–Q4 answered with defaults (see Answers). Design + ACs awaiting approval.
- 2026-10-24 10:46: Design and AC-1..AC-6 approved as written; start implement.
