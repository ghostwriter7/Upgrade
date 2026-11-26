import {
  ExerciseGroup,
  ExerciseOption,
  ExerciseVm,
  SortDirection,
  SortKey,
} from './add-exercises.models';
import { EXERCISE_TYPE_LABELS } from '@domain/enum/exercise-types.enum';

/**
 * Pure functions behind the Add exercises view. No Angular imports, so they
 * can be unit-tested directly.
 */

const DAY_MS = 86_400_000;

/* ----------------------------- dates ----------------------------- */

/** Normalises `lastPerformedAt` to epoch ms, or null when missing or unparsable. */
export function toEpochMs(value: ExerciseOption['lastPerformedAt'] | undefined): number | null {
  if (value === null || value === undefined) return null;

  let ms: number;
  if (value instanceof Date) {
    ms = value.getTime();
  } else if (typeof value === 'number') {
    ms = value;
  } else {
    // SQLite CURRENT_TIMESTAMP: "YYYY-MM-DD HH:MM:SS" in UTC, with no marker.
    const sqlite = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/.exec(value);
    ms = Date.parse(sqlite ? `${sqlite[1]}T${sqlite[2]}Z` : value);
  }
  return Number.isFinite(ms) ? ms : null;
}

/** Whole days between `lastMs` and `nowMs`, never negative. Null when never performed. */
export function daysSince(lastMs: number | null, nowMs: number): number | null {
  if (lastMs === null) return null;
  return Math.max(0, Math.floor((nowMs - lastMs) / DAY_MS));
}

export function formatLastDone(days: number | null): string {
  if (days === null) return 'Never done';
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

/* ----------------------------- search ----------------------------- */

/** Lower-case, strips accents and punctuation: "Pull-Ups!" -> "pull ups". */
export function normalise(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

export function buildSearchText(ex: ExerciseOption): string {
  return normalise(
    [ex.name, ...(ex.aliases ?? []), EXERCISE_TYPE_LABELS[ex.type], ...(ex.muscleGroups ?? []), ...(ex.equipment ?? [])].join(' '),
  );
}

/** Splits a raw query into normalised tokens. Empty array means "no search". */
export function queryTokens(query: string): string[] {
  const n = normalise(query);
  return n ? n.split(' ') : [];
}

/** Every token must appear somewhere in the haystack ("chin up" finds "Chin Ups"). */
export function matchesTokens(searchText: string, tokens: readonly string[]): boolean {
  return tokens.every((t) => searchText.includes(t));
}

/* ----------------------------- view model ----------------------------- */

export function toViewModel(exercise: ExerciseOption, nowMs: number): ExerciseVm {
  const lastMs = toEpochMs(exercise.lastPerformedAt);
  return { exercise, lastMs, days: daysSince(lastMs, nowMs), searchText: buildSearchText(exercise) };
}

/* ----------------------------- sorting ----------------------------- */

const byName = (a: ExerciseVm, b: ExerciseVm): number =>
  a.exercise.name.localeCompare(b.exercise.name, undefined, { sensitivity: 'base', numeric: true });

/**
 * "lastDone" ascending = longest ago first, and never-done counts as longest ago.
 * Descending = most recent first, never-done last. Ties fall back to name A-Z.
 * "name" is A-Z (asc) or Z-A (desc).
 */
export function compareVm(a: ExerciseVm, b: ExerciseVm, key: SortKey, dir: SortDirection): number {
  const sign = dir === 'asc' ? 1 : -1;
  if (key === 'name') return sign * byName(a, b);

  const av = a.lastMs ?? Number.NEGATIVE_INFINITY;
  const bv = b.lastMs ?? Number.NEGATIVE_INFINITY;
  const diff = av === bv ? 0 : av < bv ? -1 : 1;
  return sign * diff || byName(a, b);
}

/* ----------------------------- grouping ----------------------------- */

interface RecencyBucket {
  readonly id: string;
  readonly label: string;
  readonly minDays: number;
  readonly maxDays: number;
}

const NEVER_BUCKET: RecencyBucket = { id: 'never', label: 'Never done', minDays: Infinity, maxDays: Infinity };

const RECENCY_BUCKETS: readonly RecencyBucket[] = [
  { id: 'week', label: 'This week', minDays: 0, maxDays: 7 },
  { id: 'month', label: 'This month', minDays: 8, maxDays: 30 },
  { id: 'two-months', label: '1–2 months', minDays: 31, maxDays: 60 },
  { id: 'four-months', label: '2–4 months', minDays: 61, maxDays: 120 },
  { id: 'older', label: 'Over 4 months', minDays: 121, maxDays: Infinity },
];

function bucketFor(days: number | null): RecencyBucket {
  if (days === null) return NEVER_BUCKET;
  return RECENCY_BUCKETS.find((b) => days <= b.maxDays) ?? RECENCY_BUCKETS[RECENCY_BUCKETS.length - 1];
}

/**
 * Splits already-sorted rows into consecutive groups.
 * - sorted by last done: recency buckets ("Over 4 months", "2–4 months", ...)
 * - sorted by name: first letter ("#" for non-letters)
 */
export function groupRows(rows: readonly ExerciseVm[], key: SortKey, overdueDays: number): ExerciseGroup[] {
  const groups: { id: string; label: string; overdue: boolean; rows: ExerciseVm[] }[] = [];

  for (const row of rows) {
    let id: string;
    let label: string;
    let overdue = false;

    if (key === 'lastDone') {
      const bucket = bucketFor(row.days);
      id = bucket.id;
      label = bucket.label;
      overdue = bucket.id !== 'never' && bucket.minDays > overdueDays;
    } else {
      const first = row.exercise.name.trim().charAt(0).toLocaleUpperCase();
      id = label = /\p{L}/u.test(first) ? first : '#';
    }

    const last = groups.at(-1);
    if (last?.id === id) {
      last.rows.push(row);
    } else {
      groups.push({ id, label, overdue, rows: [row] });
    }
  }
  return groups;
}
