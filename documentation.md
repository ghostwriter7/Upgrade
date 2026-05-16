# Upgrade — Application Baseline

## Product summary
Upgrade is a single‑page Angular app for logging flexibility/mobility training sessions. Users start a session, add exercises, record sets (bodyweight, weighted, or isometric), optionally add notes, and then complete the session. Sessions are organized by date and displayed in a calendar and daily session views. Data is stored locally in the browser; there is no backend integration.

## Primary user flows
- Start a new session from the home page.
- Select one or more exercises from the predefined library.
- Add sets to each exercise (optionally copy the last set), edit or delete sets, and add exercise‑level notes.
- Edit session start/finish times and optionally use a built‑in timer.
- Complete a session to mark it read‑only.
- Browse sessions via calendar (month) and day navigation.

## Feature inventory
- Home
  - “Start Session” CTA.
  - Monthly calendar with navigation and per‑day session indicators.
- Sessions
  - Create a new session (`/session/new`).
  - View sessions for a specific date (`/session/:date`).
  - Daily pagination (previous/next day).
  - Auto‑save: session edits persist after a short debounce.
  - Complete session to lock editing.
  - Delete a session (with confirmation).
- Exercises
  - Predefined exercise catalog (static list).
  - Multi‑select exercise picker for a session.
  - Exercise‑level notes.
  - Delete an exercise (with confirmation).
- Sets
  - Add sets with type‑specific fields:
    - Bodyweight: reps.
    - Weighted: reps + weight.
    - Isometric: duration (+ optional weight).
  - Edit or delete a set.
  - Clone last set for quick entry.
- Timing
  - Edit session start and finish times.
  - Display session duration once finished.
  - Simple in‑session timer (start/pause/reset).

## Data model
- Session
  - `uuid`, `createdAt`, `startedAt`, `finishedAt`, `notes` (currently unused in UI), `exercises`.
- ExerciseLog
  - `exerciseId`, `sets`, `notes`.
- ExerciseSet
  - `type` is one of `bodyweight`, `weight`, `iso`.
  - Bodyweight: `reps`.
  - Weighted: `reps`, `weight`.
  - Isometric: `duration`, optional `weight`.
- Exercise
  - `uuid`, `name`, optional `description`.

## Storage and persistence
- IndexedDB database: `upgrade`.
  - Object store: `sessions` (key: `uuid`).
  - Index: `startedAt` for date queries and calendar counts.
- Zod schemas validate DTOs on read.
- Session data is mapped to/from domain models and stored as ISO strings.
- Time handling is based on Temporal with a fixed timezone: `Europe/Warsaw`.

## Architecture and code organization
- `src/app/domain`: domain models (Session, Exercise, ExerciseSet).
- `src/app/store`: state management using `@ngrx/signals`.
  - `ExerciseStore` holds the static exercise catalog.
  - `SessionStore` manages active date, session cache, and calendar counts.
- `src/app/persistence`: IndexedDB repository layer + Zod schema + mappers.
- `src/app/home`: home page and calendar UI.
- `src/app/session`: session creation, editing, and viewing components.
- `src/app/ui`: layout shell, content outlet, loader, and shared pipes.

## Routing
- `/` → Home page (start session + calendar).
- `/session/new` → Create a new session (preloaded empty session).
- `/session/:date` → View sessions for a given date (YYYY‑MM‑DD).

## State management behavior
- Sessions are cached by date; loading state is inferred from cache presence.
- Calendar counts are cached by month and year.
- Session edits use a linked signal and auto‑persist after debounce.

## Tech stack
- Framework: Angular 21 (standalone components + signals).
- UI: Angular Material + Angular CDK.
- State: `@ngrx/signals`.
- Time: `@js-temporal/polyfill` with global `Temporal` typings.
- Persistence: IndexedDB.
- Validation: Zod.
- Testing: Vitest (via `ng test`).
- Tooling: TypeScript 5.9, Prettier.

## Extensibility notes
- Add new features by:
  - Extending domain models in `src/app/domain`.
  - Updating DTO schemas/mappers in `src/app/persistence`.
  - Expanding stores in `src/app/store`.
  - Adding UI in `src/app/session` or `src/app/home` and wiring routes in `src/app/app.routes.ts`.
- Exercise catalog is currently static; a UI for managing custom exercises would require new persistence and store actions.
- Session notes exist in the model but do not have a UI entry point.

## Known constraints / assumptions
- Data is local only (no sync, no auth).
- Timezone is fixed to Europe/Warsaw regardless of user locale.
- Calendar shows session presence but not session summaries.

---
Last updated: 2026-05-15
