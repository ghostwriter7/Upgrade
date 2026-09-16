import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Exercise, NewExercise } from '@domain/model/exercise.model';
import { computed, effect, inject } from '@angular/core';
import { Skill } from '@domain/model/skill';
import { DateHelper } from '@common/helper/date.helper';
import { SkillStore } from '@store/skill.store';
import { Database } from '@infrastructure/database';
import { ExerciseCapabilitySchema, ExerciseSchema } from '@persistence/schema/skill.schema';
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
    exercises: computed(() => {
      const skill = store.activeSkill();
      if (!skill) return store.allExercises();

      return findSupportingExercises(skill, store.allExercises());
    }),
    exerciseNames: computed(
      () => new Set(store.allExercises().map((exercise) => exercise.name.toLowerCase())),
    ),
  })),
  withMethods((store, drillRepository = inject(DrillRepository)) => ({
    existsByName: (name: string) => store.exerciseNames().has(name),

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

    save: (drill: NewExercise) => {
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
  })),
  withHooks((store, database = inject(Database), skillStore = inject(SkillStore)) => ({
    onInit: async () => {
      effect(() => {
        const skills = skillStore.skills();
        patchState(store, (state) => ({
          ...state,
          allExercises: state.allExercises.map((exercise) => ({
            ...exercise,
            skillScore: skills.reduce(
              (skillScore, skill) => ({
                ...skillScore,
                [skill.id]: calculateSkillScore(exercise, skill),
              }),
              {},
            ),
          })),
        }));
      });

      const [exercises, exerciseCapabilities] = await Promise.all([
        database.queryMany(`select e.id, e.name, max(el.created_at) as lastPerformedAt
                              from exercise e
                                     left join exercise_log el on e.id = el.exercise_id
                              group by e.id, e.name
          `),
        database.queryMany(
          'select exercise_id as exerciseId, capability_id as capabilityId, weight from exercise_capability',
        ),
      ]);

      const now = DateHelper.now();

      const capabilitiesByExerciseId = Object.groupBy(
        exerciseCapabilities.map((ec) => ExerciseCapabilitySchema.parse(ec)),
        (ec) => ec.exerciseId,
      );

      const allExercises = Iterator.from(exercises)
        .map((e) => ExerciseSchema.parse(e))
        .map((exercise) => {
          const capabilities = capabilitiesByExerciseId[exercise.id] ?? [];
          const lastPerformedAt = exercise.lastPerformedAt
            ? DateHelper.from(exercise.lastPerformedAt)
            : null;
          const lastPerformedHoursAgo = lastPerformedAt
            ? lastPerformedAt.until(now).round({ largestUnit: 'hours' }).hours
            : null;

          return {
            ...exercise,
            skillScore: {},
            capabilities,
            stats: {
              lastPerformedAt,
              lastPerformedHoursAgo,
            },
          };
        })
        .toArray();

      patchState(store, { allExercises });
    },
  })),
);

function findSupportingExercises(skill: Skill, exercises: Exercise[]): Exercise[] {
  const capabilityIds = new Set(skill.capabilities.map((capability) => capability.capabilityId));
  const importanceByCapabilityId = skill.capabilities.reduce(
    (index, { capabilityId, importance }) => ({ ...index, [capabilityId]: importance }),
    {} as Record<string, number>,
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
  importanceByCapabilityId: Record<string, number>,
): number {
  return (
    exercise.capabilities?.reduce(
      (score, { capabilityId, weight }) =>
        score + (importanceByCapabilityId[capabilityId] ?? 0) * weight,
      0,
    ) ?? 0
  );
}

function calculateSkillScore(exercise: Omit<Exercise, 'skillScore'>, skill: Skill): number {
  const exerciseCapabilities = new Map(
    exercise.capabilities?.map((c) => [c.capabilityId, c.weight]) ?? [],
  );

  const totalImportance = skill.capabilities.reduce((sum, c) => sum + c.importance, 0);

  if (totalImportance === 0) {
    return 0;
  }

  const contribution = skill.capabilities.reduce(
    (sum, skillCapability) =>
      sum +
      skillCapability.importance * (exerciseCapabilities.get(skillCapability.capabilityId) ?? 0),
    0,
  );

  return contribution / totalImportance;
}
