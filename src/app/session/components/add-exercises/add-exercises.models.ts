/**
 * Public contract of the "Add exercises" view.
 *
 * The components never talk to SQLite. The parent maps its rows to
 * `ExerciseOption[]` and passes them in; the components report what the user
 * did through outputs.
 */

import { ExerciseType } from '@domain/enum/exercise-types.enum';

/**
 * One selectable exercise: the only data shape the view needs.
 */
export interface ExerciseOption {
  /** Stable, unique id. Used for selection, tracking and in the emitted result. */
  readonly id: string;

  /** Display name, e.g. "Back Squats". */
  readonly name: string;

  /** Category. Required: every exercise needs an icon, a tint and a chip. */
  readonly type: ExerciseType;

  /** Shown nowhere, but searched and (if any exercise has them) offered as advanced filters. e.g. ["Legs", "Glutes"]. */
  readonly muscleGroups?: readonly string[];

  /** Searched and offered as advanced filters. e.g. ["Barbell", "Rack"]. Use [] or omit for bodyweight. */
  readonly equipment?: readonly string[];

  /** Alternative names, searched only. e.g. ["Pull-up", "Pullup"]. */
  readonly aliases?: readonly string[];

  /** Favourites get a star in the row and match the "Favourites" chip. */
  readonly isFavourite: boolean;

  /**
   * When the exercise was last logged, or `null` if never.
   *
   * Accepts epoch milliseconds, a `Date`, or a string. Prefer ISO 8601 with
   * an offset ("2026-11-25T09:48:00Z"). SQLite's `CURRENT_TIMESTAMP` format
   * ("2026-11-25 09:48:00", UTC without a marker) is also handled as UTC.
   */
  readonly lastPerformedAt: Date | string | number | null;
}

/** Optional tuning. Every field has a default. */
export interface AddExercisesConfig {
  /** "Recent" chip: performed within this many days. Default 30. */
  readonly recentDays: number;
  /** "Overdue" chip and amber styling: last performed more than this many days ago. Default 120. */
  readonly overdueDays: number;
}

export const DEFAULT_ADD_EXERCISES_CONFIG: AddExercisesConfig = {
  recentDays: 30,
  overdueDays: 120,
};

export type SortKey = 'lastDone' | 'name';
export type SortDirection = 'asc' | 'desc';

/* ---------- Internal view-model types (exported for the utils and tests) ---------- */

export interface ExerciseVm {
  readonly exercise: ExerciseOption;
  /** Last performed, epoch ms, or null. */
  readonly lastMs: number | null;
  /** Whole days since last performed (>= 0), or null when never. */
  readonly days: number | null;
  /** Normalised haystack used by search. */
  readonly searchText: string;
}

export interface ExerciseGroup {
  readonly id: string;
  readonly label: string;
  /** Amber header styling. */
  readonly overdue: boolean;
  readonly rows: readonly ExerciseVm[];
}
