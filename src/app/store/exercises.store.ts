import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Exercise } from '../domain/model/exercise.model';
import { exercises } from './exercises.const';

const DefaultExercises: Exercise[] = exercises.map(
  ({ uuid, name, description }) => new Exercise(uuid, name, description),
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
    getExerciseById: (uuid: string) => store.exercises().find((exercise) => exercise.uuid === uuid),
  })),
  withMethods((store) => {
    const getExerciseIndex = (uuid: string): number =>
      store.exercises().findIndex((exercise) => exercise.uuid === uuid);

    return {
      create: (exercise: Exercise) =>
        patchState(store, (state) => ({
          ...state,
          exercises: [...state.exercises, exercise].sort((a, b) => a.name.localeCompare(b.name)),
        })),
      update: (exercise: Exercise) => {
        const existingExerciseIndex = getExerciseIndex(exercise.uuid);

        if (existingExerciseIndex === -1)
          throw new Error(`Exercise with UUID ${exercise.uuid} not found`);

        const existingExercise = store.exercises()[existingExerciseIndex];
        patchState(store, (state) => ({
          ...state,
          exercises: state.exercises.with(existingExerciseIndex, {
            ...existingExercise,
            ...exercise,
          }),
        }));
      },
    };
  }),
);
