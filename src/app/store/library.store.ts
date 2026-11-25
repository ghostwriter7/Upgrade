import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Exercise, UpsertExercisePayload } from '@domain/model/exercise.model';
import { computed, inject } from '@angular/core';
import { DateHelper } from '@common/helper/date.helper';
import { LibraryRepository } from '@persistence/repository/library.repository';

interface State {
  exercises: Exercise[];
}

const initialState: State = {
  exercises: [],
};

export const LibraryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    exerciseNames: computed(
      () => new Set(store.exercises().map((exercise) => exercise.name.toLowerCase())),
    ),
    exerciseById: computed(() =>
      store.exercises().reduce(
        (lookup, exercise) => {
          lookup[exercise.id] = exercise;
          return lookup;
        },
        {} as Record<string, Exercise>,
      ),
    ),
  })),
  withMethods((store, libraryRepository = inject(LibraryRepository)) => ({
    existsByName: (name: string) => store.exerciseNames().has(name),

    saveExercise: (exercise: UpsertExercisePayload) => {
      patchState(store, (state) => ({
        ...state,
        exercises: [
          ...state.exercises,
          {
            ...exercise,
            stats: {
              lastPerformedAt: null,
              lastPerformedHoursAgo: null,
            },
          },
        ].toSorted((a, b) => a.name.localeCompare(b.name)),
      }));
      libraryRepository.saveExercise(exercise);
    },

    updateExercise: (exercise: UpsertExercisePayload) => {
      const exerciseIndex = store.exercises().findIndex((d) => d.id === exercise.id);
      const existingExercise = store.exercises()[exerciseIndex];
      const updatedExercise = { ...existingExercise, ...exercise };

      patchState(store, (state) => ({
        ...state,
        exercises: state.exercises.with(exerciseIndex, updatedExercise),
      }));
      libraryRepository.updateExercise(exercise);
    },

    deleteExercise: (exercise: Pick<Exercise, 'id'>): void => {
      libraryRepository.deleteExerciseById(exercise.id);
      patchState(store, (state) => ({
        ...state,
        exercises: state.exercises.filter((e) => e.id !== exercise.id),
      }));
    },
  })),
  withHooks((store, libraryRepository = inject(LibraryRepository)) => ({
    onInit: async () => {
      const now = DateHelper.now();

      const exercises = (await libraryRepository.getAllExercises()).map((exercise) => {
        const lastPerformedAt = exercise.lastPerformedAt
          ? DateHelper.from(exercise.lastPerformedAt)
          : null;
        const lastPerformedHoursAgo = lastPerformedAt
          ? lastPerformedAt.until(now).round({ largestUnit: 'hours' }).hours
          : null;

        return {
          ...exercise,
          stats: {
            lastPerformedAt,
            lastPerformedHoursAgo,
          },
        };
      });

      patchState(store, { exercises });
    },
  })),
);
