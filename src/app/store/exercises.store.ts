import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Exercise } from '@domain/model/exercise.model';
import { exercises } from './exercises.const';
import { computed } from '@angular/core';
import { Skills } from '@domain/enum/skill-tag.enum';
import { Skill } from '@domain/model/skill';

interface State {
  activeSkill: Skill | undefined;
  allExercises: Exercise[];
}

const initialState: State = {
  activeSkill: undefined,
  allExercises: exercises.map(
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
    exercises: computed(() => {
      const skill = store.activeSkill();
      if (!skill) return store.allExercises();

      const capabilityIds = new Set(
        skill.capabilities.map((capability) => capability.capabilityId),
      );
      return store
        .allExercises()
        .filter((exercise) =>
          exercise.capabilities?.some((capability) => capabilityIds.has(capability.capabilityId)),
        );
    }),
    skillsByExerciseId: computed(() =>
      store.allExercises().reduce((index, exercise) => {
        index.set(exercise.id, exercise.skillTags ?? []);
        return index;
      }, new Map<string, Skills[]>()),
    ),
  })),
  withMethods((store) => ({
    setActiveSkill: (activeSkill: Skill | undefined) => patchState(store, { activeSkill }),
    getExerciseById: (id: string) => store.exercises().find((exercise) => exercise.id === id),
  })),
);
