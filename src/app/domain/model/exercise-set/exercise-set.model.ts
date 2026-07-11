export const ExerciseSetTypes = ['bodyweight', 'weight', 'iso', 'duration'] as const;
export type ExerciseSetType = (typeof ExerciseSetTypes)[number];

export type ExerciseSet = BodyweightSet | WeightedSet | IsoSet | DurationSet;

export interface BaseSet {
  id?: string;
  sessionId: string;
  exerciseId: string;
  index: number;
}

export interface BodyweightSet extends BaseSet {
  type: 'bodyweight';
  reps: number;
}

export interface WeightedSet extends BaseSet {
  type: 'weight';
  reps: number;
  weight: number;
}

export interface IsoSet extends BaseSet {
  type: 'iso';
  duration: number;
  weight?: number;
}

export interface DurationSet extends BaseSet {
  type: 'duration';
  duration: number;
}
