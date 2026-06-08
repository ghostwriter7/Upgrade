import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';

export interface SetData {
  type: ExerciseSetType;
  reps: number;
  weight: number;
  duration: number;
}
