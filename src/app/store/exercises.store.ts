import { signalStore, withMethods, withState } from '@ngrx/signals';
import { Exercise } from '@domain/model/exercise.model';
import { exercises } from './exercises.const';

interface State {
  exercises: Exercise[];
}

const initialState: State = {
  exercises: exercises.map(({ id, name, description, measurementDefinition }) => {
    const exercise = new Exercise(id, name, description);
    exercise.measurementDefinition = measurementDefinition;
    return exercise;
  }),
};

export const ExerciseStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    getExerciseById: (uuid: string) => store.exercises().find((exercise) => exercise.id === uuid),
  })),
);
