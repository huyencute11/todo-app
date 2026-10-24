# Verification: todo-app (lite)

Run: 2026-10-24 11:02–11:04, Node v25.2.1, Chromium (Playwright 1.64.1).
Raw output: [`evidence/test-results.txt`](evidence/test-results.txt).

## AC → evidence matrix

| AC | Description | Tests | Result | Evidence |
|----|-------------|-------|--------|----------|
| AC-1 | Adding "Buy milk" shows it unchecked and clears the input | e2e `AC-1: adds a todo`; unit `AC-1: appends a trimmed, active todo…`; component `AC-1: adds a todo and clears the input` | ✅ Pass | `AC-1-before-empty.png`, `AC-1-todo-added.png` |
| AC-2 | Blank or whitespace-only input adds nothing | unit `AC-2: rejects blank title` ×3; component `AC-2: does not add a todo for blank input` | ✅ Pass | `test-results.txt` |
| AC-3 | Tick → completed; untick → active again | e2e `AC-3: toggles completion`; unit `AC-3: completes the target only…` | ✅ Pass | `AC-3-completed.png`, `AC-3-active-again.png` |
| AC-4 | Delete "A" from "A, B" leaves only "B" | e2e `AC-4: deletes a todo`; unit `AC-4: removes only the target todo` | ✅ Pass | `AC-4-before-delete.png`, `AC-4-deleted.png` |
| AC-5 | Todos and completed state survive a reload | e2e `AC-5: persists across reload`; unit `AC-5: round-trips todos…` | ✅ Pass | `AC-5-before-reload.png`, `AC-5-after-reload.png` |
| AC-6 | Invalid or unreadable saved data → empty state, no crash | unit `AC-6: falls back…` ×4 (invalid JSON, non-array, malformed items, read throws); component `AC-6: shows the empty state…` | ✅ Pass | `test-results.txt` |

Every screenshot was opened and checked: each shows the claimed state, with no blank
page or error overlay. Each one is taken after its assertions pass.

## Overall
- **Result: all 6 ACs pass.**
- Unit/component: 16/16 passed (3 files). E2E: 4/4 passed.
- Lint (oxlint): clean. Typecheck (`tsc -b`): clean.
- Unit suite also confirmed on Node 24.11.1 during review (R1 fix).

## Not verified / limits
- Only Chromium was tested (not Firefox or WebKit). That is enough for lite mode.
- AC-1 "click Add" path: covered only in jsdom with blank input, not e2e (review R4, follow-up).
- Blocked-storage behaviour (AC-6, R2) is proven by a stubbed unit test, not a real browser with site data blocked.

## Changes made during verify
- Added `e2e/evidence.ts` screenshot fixture, plus evidence calls in `e2e/todos.spec.ts` (assert first, capture second). No assertions were removed. I added two extra assertions so the "before" shots are taken in a known state (AC-4 count = 2, AC-5 checked before reload).
- `playwright.config.ts`: HTML reporter; trace/video/screenshot kept on failure only.
- Fixed two problems this change caused: the import needed a `.ts` extension (nodenext resolution), and I renamed the fixture callback `use` → `provide` because oxlint's React hooks rule mistook it for React's `use`.

## Acceptance audit
Independent `acceptance-auditor` agent. **Verdict: all 6 ACs proven.** Each test
would fail if its behaviour broke, and all 8 screenshots show the claimed state
(the auditor opened them too).

| AC | Proven? | Strengthening suggested |
|----|---------|-------------------------|
| AC-1 | Yes | E2E "click Add" with a real title (same as review R4); assert list count = 1 |
| AC-2 | Yes | Optional: blank input submitted with Enter in the component test |
| AC-3 | Yes | None |
| AC-4 | Yes | `exact: true` on role names; assert "A" count = 0 |
| AC-5 | Yes | Assert count/order after reload; pin "Walk dog" unchecked before reload |
| AC-6 | Yes | Optional e2e with corrupt data seeded via `addInitScript` |

Gaps found:
1. **Evidence can't be regenerated with the documented command.** `e2e/evidence.ts` defaults to
   `docs/devflow/evidence/` when `DEVFLOW_EVIDENCE_DIR` is unset, so a plain
   `npm run test:e2e` writes screenshots to the wrong folder, inside the repo.
2. "Click Add" with a real title is untested. Both paths go through the same form submit handler, so this is minor.
3. Role-name matching in the e2e tests is substring, not exact; the tests break more easily.

## Decision log
- 2026-10-24 11:04: Evidence captured; audit done (all 6 ACs proven). Awaiting user approval.
- 2026-10-24 11:05: User approved results as-is. Gap 1 (evidence dir default), R4-style 'click Add' e2e and exact role names logged as follow-ups. Proceed to ship.
