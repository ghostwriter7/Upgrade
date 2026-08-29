import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Exercise } from '@domain/model/exercise.model';
import { exercises } from './exercises.const';
import { computed, inject } from '@angular/core';
import { Skill } from '@domain/model/skill';
import { CapabilityId } from '@store/capabilities.const';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { DateHelper } from '@common/helper/date.helper';

interface State {
  activeSkill: Skill | undefined;
  allExercises: Exercise[];
}

const initialState: State = {
  activeSkill: undefined,
  allExercises: exercises,
};

export const ExerciseStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    exercises: computed(() => {
      const skill = store.activeSkill();
      if (!skill) return store.allExercises();

      return findSupportingExercises(skill, store.allExercises());
    }),
  })),
  withMethods((store) => ({
    setActiveSkill: (activeSkill: Skill | undefined) => patchState(store, { activeSkill }),
    getExerciseById: (id: string) => store.exercises().find((exercise) => exercise.id === id),

    getExercisesForSkill: (skill: Skill): Exercise[] =>
      findSupportingExercises(skill, store.allExercises()),

    getDrillsForSkills: (skills: Skill[]): Exercise[] => {
      const drills = skills.flatMap((skill) =>
        findSupportingExercises(skill, store.allExercises()),
      );
      const seen = new Set<string>();
      return drills
        .filter((drill) => {
          if (seen.has(drill.id)) return false;
          seen.add(drill.id);
          return true;
        })
        .toSorted((a, b) => a.name.localeCompare(b.name));
    },
  })),
  withHooks((store, exerciseLogRepository = inject(ExerciseLogRepository)) => ({
    onInit: async () => {
      const allExercises = store.allExercises();
      const exerciseIds = allExercises.map(({ id }) => id);

      const latestLogs = await Promise.all(
        exerciseIds.map((id) => exerciseLogRepository.findLatestExerciseLogsByExerciseId(id)),
      );

      const lastDateByExerciseId = latestLogs
        .filter((log) => !!log.length)
        .reduce(
          (index, [{ exerciseId, createdAt }]) => ({ ...index, [exerciseId]: createdAt }),
          {} as Record<string, Temporal.Instant>,
        );

      const now = DateHelper.now();

      patchState(store, {
        allExercises: allExercises.map((exercise) => {
          const lastPerformedAt = lastDateByExerciseId[exercise.id];
          const lastPerformedHoursAgo = lastPerformedAt
            ? lastPerformedAt.until(now).round({ largestUnit: 'hours' }).hours
            : 0;
          return {
            ...exercise,
            stats: {
              lastPerformedAt,
              lastPerformedHoursAgo,
            },
          };
        }),
      });
    },
  })),
);

function findSupportingExercises(skill: Skill, exercises: Exercise[]): Exercise[] {
  const capabilityIds = new Set(skill.capabilities.map((capability) => capability.capabilityId));
  const importanceByCapabilityId = skill.capabilities.reduce(
    (index, { capabilityId, importance }) => ({ ...index, [capabilityId]: importance }),
    {} as Record<CapabilityId, number>,
  );
  return exercises
    .filter((exercise) =>
      exercise.capabilities?.some((capability) => capabilityIds.has(capability.capabilityId)),
    )
    .map((exercise) => {
      const score = computeScore(exercise, importanceByCapabilityId);
      return { score, exercise };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ exercise }) => exercise);
}

function computeScore(
  exercise: Exercise,
  importanceByCapabilityId: Record<CapabilityId, number>,
): number {
  return (
    exercise.capabilities?.reduce(
      (score, { capabilityId, weight }) =>
        score + (importanceByCapabilityId[capabilityId] ?? 0) * weight,
      0,
    ) ?? 0
  );
}
