import { exercises } from '../../src/app/store/exercises.const';

export function getExerciseUuid(name: string): string | undefined {
  return exercises.find((exercise) => exercise.name === name)?.uuid;
}

