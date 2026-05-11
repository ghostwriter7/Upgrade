import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Exercise } from '../domain/model/exercise.model';

const now = new Date().toISOString();
const DefaultExercises: Exercise[] = [
  new Exercise('aad365b9-4660-429a-84f6-a590f9d75a10', 'Isometric Front Split', null, now, null),
  new Exercise('32aea503-5a4a-4249-a56e-c92f3793bc84', 'Front Split Slides', null, now, null),
  new Exercise('a0124f1e-148a-49e0-8cfd-e0844f7635e1', 'Couch Stretch - High', 'Hips in high position. It targets quads.', now, null),
  new Exercise('e65ac292-43d6-49b4-a602-56ee2a03ed74', 'Couch Stretch - Low', 'Hips in low position. It targets hip flexors.', now, null),
  new Exercise('4b2415a0-486a-4a27-9056-5c07006e1454', 'Reverse Nordic Curls', null, now, null),
  new Exercise('fbd043fd-6dd0-4882-a88f-9fb8126c9789', 'Kneeling Needle', null, now, null),
  new Exercise('3a7a3406-7daa-402f-9943-2eb69706ea0b', 'Split Squats', null, now, null),
];

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

        if (existingExerciseIndex === -1) throw new Error(`Exercise with UUID ${exercise.uuid} not found`);

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
