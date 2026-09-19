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
import { LibraryRepository } from '@persistence/repository/library.repository';

interface State {
  activeSkill: Skill | undefined;
  exercises: Exercise[];
  skills: Skill[];
}

const initialState: State = {
  activeSkill: undefined,
  exercises: [],
  skills: [],
};

export const LibraryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    exerciseBySkillId: computed(() =>
      store.exercises().reduce((lookup, exercise) => {
        exercise.skillIds?.forEach((skillId) => lookup.getOrInsert(skillId, []).push(exercise));
        return lookup;
      }, new Map<string, Exercise[]>()),
    ),
    skillsById: computed(() =>
      store
        .skills()
        .reduce((index, skill) => ({ ...index, [skill.id]: skill }), {} as Record<string, Skill>),
    ),
  })),
  withComputed((store) => ({
    activeExercises: computed(() => {
      const skill = store.activeSkill();
      if (!skill) return store.exercises();
      return store.exerciseBySkillId().get(skill.id) ?? [];
    }),
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

    saveSkill: (skill: Skill, exerciseIds: string[]) => {
      const ids = new Set(exerciseIds);

      patchState(store, (state) => ({
        ...state,
        skills: [...state.skills, skill].sort((a, b) => a.name.localeCompare(b.name)),
        exercises: state.exercises.map((exercise) =>
          ids.has(exercise.id)
            ? { ...exercise, skillIds: [...exercise.skillIds, skill.id] }
            : exercise,
        ),
      }));

      libraryRepository.saveSkill(skill, exerciseIds);
    },

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

    saveDrill: (drill: UpsertExercisePayload) => {
      patchState(store, (state) => ({
        ...state,
        exercises: [
          ...state.exercises,
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
      libraryRepository.saveDrill(drill);
    },

    update: (drill: UpsertExercisePayload) => {
      const drillIndex = store.exercises().findIndex((d) => d.id === drill.id);
      const existingDrill = store.exercises()[drillIndex];
      const updatedDrill = { ...existingDrill, ...drill };

      const removedSkillIds =
        existingDrill.skillIds?.filter((id) => !drill.skillIds?.includes(id)) ?? [];
      const addedSkillIds =
        drill.skillIds?.filter((id) => !existingDrill.skillIds?.includes(id)) ?? [];

      patchState(store, (state) => ({
        ...state,
        exercises: state.exercises.with(drillIndex, updatedDrill),
      }));
      libraryRepository.updateDrill(drill, removedSkillIds, addedSkillIds);
    },
  })),
  withHooks((store, drillRepository = inject(LibraryRepository)) => ({
    onInit: async () => {
      drillRepository.getAllSkills().then((skills) => {
        patchState(store, (state) => ({
          ...state,
          skills: skills.toSorted((a, b) => a.name.localeCompare(b.name)),
        }));
      });

      const drills = await drillRepository.getAllDrills();

      const now = DateHelper.now();

      const exercises = drills.map((exercise) => {
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
      });

      patchState(store, { exercises });
    },
  })),
);
