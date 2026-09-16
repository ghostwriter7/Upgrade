import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';

export const SetType: Record<ExerciseSetType, string> = {
  bodyweight: 'Bodyweight',
  weight: 'Weighted',
  iso: 'Isometric',
  duration: 'Long Practice',
};
