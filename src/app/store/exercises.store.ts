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
import { Skill } from '@domain/model/skill';
import { DateHelper } from '@common/helper/date.helper';
import { SkillStore } from '@store/skill.store';
import { Database } from '@infrastructure/database';
import { DrillRepository } from '@persistence/repository/drill.repository';

interface State {
  activeSkill: Skill | undefined;
  allExercises: Exercise[];
}

const initialState: State = {
  activeSkill: undefined,
  allExercises: [],
};

export const ExerciseStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    exerciseBySkillId: computed(() =>
      store.allExercises().reduce((lookup, exercise) => {
        exercise.skillIds?.forEach((skillId) => lookup.getOrInsert(skillId, []).push(exercise));
        return lookup;
      }, new Map<string, Exercise[]>()),
    ),
  })),
  withComputed((store) => ({
    exercises: computed(() => {
      const skill = store.activeSkill();
      if (!skill) return store.allExercises();
      return store.exerciseBySkillId().get(skill.id) ?? [];
    }),
    exerciseNames: computed(
      () => new Set(store.allExercises().map((exercise) => exercise.name.toLowerCase())),
    ),
    exerciseById: computed(() =>
      store.allExercises().reduce(
        (lookup, exercise) => {
          lookup[exercise.id] = exercise;
          return lookup;
        },
        {} as Record<string, Exercise>,
      ),
    ),
  })),
  withMethods((store, drillRepository = inject(DrillRepository)) => ({
    existsByName: (name: string) => store.exerciseNames().has(name),

    setActiveSkill: (activeSkill: Skill | undefined) => patchState(store, { activeSkill }),

    getDrillsForSkills: (skills: Skill[]): Exercise[] => {
      const drills = skills.flatMap((skill) => store.exerciseBySkillId().get(skill.id) ?? []);
      const seen = new Set<string>();
      return drills
        .filter((drill) => {
          if (seen.has(drill.id)) return false;
          seen.add(drill.id);
          return true;
        })
        .toSorted((a, b) => a.name.localeCompare(b.name));
    },

    save: (drill: UpsertExercisePayload) => {
      patchState(store, (state) => ({
        ...state,
        allExercises: [
          ...state.allExercises,
          {
            ...drill,
            stats: {
              lastPerformedAt: null,
              lastPerformedHoursAgo: null,
            },
            skillScore: {},
          },
        ].toSorted((a, b) => a.name.localeCompare(b.name)),
      }));
      drillRepository.save(drill);
    },

    update: (drill: UpsertExercisePayload) => {
      const drillIndex = store.allExercises().findIndex((d) => d.id === drill.id);
      const existingDrill = store.allExercises()[drillIndex];
      const updatedDrill = { ...existingDrill, ...drill };

      const removedSkillIds =
        existingDrill.skillIds?.filter((id) => !drill.skillIds?.includes(id)) ?? [];
      const addedSkillIds =
        drill.skillIds?.filter((id) => !existingDrill.skillIds?.includes(id)) ?? [];

      patchState(store, (state) => ({
        ...state,
        allExercises: state.allExercises.with(drillIndex, updatedDrill),
      }));
      drillRepository.update(drill, removedSkillIds, addedSkillIds);
    },
  })),
  withHooks(
    (
      store,
      database = inject(Database),
      skillStore = inject(SkillStore),
      drillRepository = inject(DrillRepository),
    ) => ({
      onInit: async () => {
        const exercises = await drillRepository.getAll();

        const now = DateHelper.now();

        const allExercises = Iterator.from(exercises)
          .map((exercise) => {
            const lastPerformedAt = exercise.lastPerformedAt
              ? DateHelper.from(exercise.lastPerformedAt)
              : null;
            const lastPerformedHoursAgo = lastPerformedAt
              ? lastPerformedAt.until(now).round({ largestUnit: 'hours' }).hours
              : null;

            return {
              ...exercise,
              skillScore: {},
              stats: {
                lastPerformedAt,
                lastPerformedHoursAgo,
              },
            };
          })
          .toArray();

        patchState(store, { allExercises });
      },
    }),
  ),
);
