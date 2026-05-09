export const ExerciseSetTypes = ['bodyweight', 'weight', 'iso'] as const;
export type ExerciseSetType = typeof ExerciseSetTypes[number];

export class ExerciseSet {
  constructor(
    public readonly type: ExerciseSetType) {}
}

export class BodyweightSet extends ExerciseSet {
  constructor(
    public readonly reps: number,
  ) {
    super('bodyweight');
  }
}

export class WeightedSet extends ExerciseSet {
  constructor(
    public readonly reps: number,
    public readonly weight: number,
  ) {
    super('weight');
  }
}

export class IsoSet extends ExerciseSet {
  constructor(
    public readonly duration: number,
    public readonly weight?: number | null,
  ) {
    super('iso');
  }
}
