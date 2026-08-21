import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Exercise } from '@domain/model/exercise.model';
import { exercises } from './exercises.const';
import { computed } from '@angular/core';
import { Skills } from '@domain/enum/skill-tag.enum';

interface State {
  exercises: Exercise[];
}

const initialState: State = {
  exercises: exercises.map(
    ({ id, name, measurementDefinition, skillTags, supportedSetTypes, capabilities }) => {
      const exercise = new Exercise(id, name, supportedSetTypes);
      exercise.measurementDefinition = measurementDefinition;
      exercise.skillTags = skillTags;
      exercise.capabilities = capabilities;
      return exercise;
    },
  ),
};

export const ExerciseStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    skillsByExerciseId: computed(() =>
      store.exercises().reduce((index, exercise) => {
        index.set(exercise.id, exercise.skillTags ?? []);
        return index;
      }, new Map<string, Skills[]>()),
    ),
  })),
  withMethods((store) => ({
    getExerciseById: (id: string) => store.exercises().find((exercise) => exercise.id === id),
  })),
);
