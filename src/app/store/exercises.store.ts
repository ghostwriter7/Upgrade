import { signalStore, withMethods, withState } from '@ngrx/signals';
import { Exercise } from '@domain/model/exercise.model';
import { exercises } from './exercises.const';

const DefaultExercises: Exercise[] = exercises.map(
  ({ id, name, description }) => new Exercise(id, name, description),
);

interface State {
  exercises: Exercise[];
}

const initialState: State = {
  exercises: [...DefaultExercises],
};

export const ExerciseStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    getExerciseById: (uuid: string) => store.exercises().find((exercise) => exercise.id === uuid),
  })),
);
