import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { effect, inject } from '@angular/core';
import { PersistenceService } from '../common/service/persistence.service';
import { Exercise, isExercise } from '../domain/model/exercise.model';
import { ExerciseFactory } from '../domain/factory/exercise.factory';
import { createUuid } from '../common/function/create-uuid.function';


const now = new Date().toISOString();
const DefaultExercises: Exercise[] = [
  new Exercise(createUuid(), 'Isometric Front Split', null, now, null),
  new Exercise(createUuid(), 'Front Split Slides', null, now, null),
  new Exercise(createUuid(), 'Couch Stretch - High', 'Hips in high position. It targets quads.', now, null),
  new Exercise(createUuid(), 'Couch Stretch - Low', 'Hips in low position. It targets hip flexors.', now, null),
  new Exercise(createUuid(), 'Reverse Nordic Curls', null, now, null),
  new Exercise(createUuid(), 'Kneeling Needle', null, now, null),
  new Exercise(createUuid(), 'Split Squats', null, now, null),
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
  withHooks((store, persistence = inject(PersistenceService)) => ({
    onInit: () => {
      const exercises = persistence.retrieve('exercises');

      if (Array.isArray(exercises) && exercises.every(isExercise)) {
        patchState(store, { exercises: [...DefaultExercises, ...exercises.map(ExerciseFactory.fromJSON)]
            .sort((a, b) => a.name.localeCompare(b.name)) });
      }

      effect(() => {
        persistence.persist('exercises', store.exercises());
      });
    },
  })),
);
