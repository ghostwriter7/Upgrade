import { Depth } from '../enum/depth.enum';
import { ExposureZone } from '../enum/exposure-zone.enum';
import { BreathQuality } from '../enum/breath-quality.enum';

export const ExerciseSetTypes = ['bodyweight', 'weight', 'iso'] as const;
export type ExerciseSetType = (typeof ExerciseSetTypes)[number];

export class ExerciseSet {
  constructor(
    public readonly type: ExerciseSetType,
    public readonly depth: Depth | null,
    public readonly exposureZone: ExposureZone | null,
    public readonly breathQuality: BreathQuality | null,
  ) {}
}

export class BodyweightSet extends ExerciseSet {
  constructor(
    public readonly reps: number,
    depth: Depth | null,
    exposureZone: ExposureZone | null,
    breathQuality: BreathQuality | null,
  ) {
    super('bodyweight', depth, exposureZone, breathQuality);
  }
}

export class WeightedSet extends ExerciseSet {
  constructor(
    public readonly reps: number,
    public readonly weight: number,
    depth: Depth | null,
    exposureZone: ExposureZone | null,
    breathQuality: BreathQuality | null,
  ) {
    super('weight', depth, exposureZone, breathQuality);
  }
}

export class IsoSet extends ExerciseSet {
  constructor(
    public readonly duration: number,
    depth: Depth | null,
    exposureZone: ExposureZone | null,
    breathQuality: BreathQuality | null,
    public readonly weight?: number,
  ) {
    super('iso', depth, exposureZone, breathQuality);
  }
}
