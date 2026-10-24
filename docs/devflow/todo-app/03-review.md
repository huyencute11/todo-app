# Review: todo-app (lite)

Reviewer: independent `code-reviewer` agent, one pass.
Scope: whole `feat/todo-app` branch against the empty tree (greenfield repo).
Reviewer's checks on Node 25.2.1: 15/15 unit, 4/4 e2e, lint and typecheck clean.
Reviewer also ran tests on Node 24.11.1: they fail to start (see R1).
Verdict: **Ready after fixes** (R1, R2).

## Findings

| ID | Severity | File:line | Issue | Suggested fix | My note | Status |
|----|----------|-----------|-------|---------------|---------|--------|
| R1 | Major | `vite.config.ts:11` | `--no-webstorage` only exists in Node 25; on Node 24 LTS every Vitest worker dies with `bad option` and no tests run. | Use `--no-experimental-webstorage` (works on 24 and 25); optionally add `engines`. | Agree. My fix only worked on my machine's Node. | Fixed (b293ff6); verified on Node 24.11.1 and 25.2.1. `engines` field: follow-up |
| R2 | Major | `src/storage.ts:18` | `localStorage.getItem` is outside the `try`; with site data blocked it throws `SecurityError` and the app renders blank instead of falling back (design E3). | Move the read inside `try`; add a unit test stubbing `getItem` to throw. | Agree. Breaks the intent of AC-6 / E3. | Fixed; test added |
| R3 | Minor | `src/useTodos.ts:8-10`, `src/storage.ts:22` | One malformed item drops the whole list, and the mount-time save then overwrites the stored data permanently. | Filter invalid items, skip first save, or back up the raw value. | Agree it's a real risk; behaviour matches the approved AC-6, so changing it needs your call. | Follow-up (changes approved AC-6 behaviour) |
| R4 | Minor | `e2e/todos.spec.ts` | AC-1 says "Enter (or click Add)"; e2e only covers Enter. | Add an e2e step that clicks Add. | Agree; cheap. | Follow-up |
| R5 | Minor | `e2e/todos.spec.ts` | No screenshots captured yet. | Add `page.screenshot` per AC. | Disagree as a review fix: capturing evidence is the verify phase's job. | Won't fix here; handled in verify |
| R6 | Minor | `src/todos.ts:14` | `crypto.randomUUID` needs a secure context; fails on `http://<LAN IP>`. | Fallback id generator or document. | Agree; out of scope for localhost. | Follow-up |
| R7 | Minor | `src/storage.ts:30-36` | `saveTodos` error path untested. | Stub `setItem` to throw; assert no throw + `console.error`. | Agree. | Follow-up |
| R8 | Minor | `src/assets/*`, `public/icons.svg` | Unused template assets. | Delete in a `chore` commit. | Agree; needs your OK (file deletion). | Follow-up (needs OK to delete) |
| R9 | Nit | `index.html:7` | Tab title is "scaffold". | `<title>Todos</title>`. | Agree; trivial. | Follow-up |
| R10 | Nit | `README.md` | Still the Vite template README. | Short project README. | Agree. | Follow-up |
| R11 | Nit | `playwright.config.ts:10` | Fixed port 5173 + `reuseExistingServer` may hit another local Vite app. | Dedicated e2e port. | Agree; low risk. | Follow-up |

## Decision log
- 2026-10-24: Review received; awaiting fix selection.
- 2026-10-24: User chose to fix R1 + R2 (lite mode: Majors only). Everything else logged as a follow-up. After fixes: 16/16 unit, 4/4 e2e, lint and typecheck clean.
