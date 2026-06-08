import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';

export const  setTypeOptions: {
  label: string;
  value: ExerciseSetType;
  testId: `set-form-type-${string}`;
}[] = (
  [
    {
      label: 'Bodyweight',
      value: 'bodyweight',
    },
    {
      label: 'Weighted',
      value: 'weight',
    },
    {
      label: 'Isometric',
      value: 'iso',
    },
  ] as const
).map((option) => ({ ...option, testId: `set-form-type-${option.value}` }));

export const durationOptions = [5, 10, 15, 20, 25, 30].map((value) => ({
  value,
  testId: `set-form-duration-${value}`,
}));

export const repOptions = [1, 2, 3, 5, 8, 10].map((value) => ({
  value,
  testId: `set-form-reps-${value}`,
}));

export const weightOptions = [1, 2, 3, 5, 8, 10].map((value) => ({
  value,
  testId: `set-form-weight-${value}`,
}));
