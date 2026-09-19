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

    updateSkill: (skill: Skill) => {
      const existingSkill = store.skillsById()[skill.id];
      const existingExerciseIds = new Set(existingSkill.exerciseIds);
      const exerciseIds = new Set(skill.exerciseIds);

      const removedExerciseIds = existingExerciseIds.difference(exerciseIds);
      const addedExerciseIds = exerciseIds.difference(existingExerciseIds);

      patchState(store, (state) => ({
        ...state,
        skills: state.skills.map((s) => (s.id === skill.id ? skill : s)),
        exercises: state.exercises.map((e) => {
          if (removedExerciseIds.has(e.id)) {
            return { ...e, skillIds: e.skillIds.filter((id) => id !== skill.id) };
          }
          if (addedExerciseIds.has(e.id)) {
            return { ...e, skillIds: [...e.skillIds, skill.id] };
          }
          return e;
        }),
      }));

      libraryRepository.updateSkill(skill, removedExerciseIds, addedExerciseIds);
    },

    saveSkill: (skill: Skill) => {
      const ids = new Set(skill.exerciseIds);

      patchState(store, (state) => ({
        ...state,
        skills: [...state.skills, skill].sort((a, b) => a.name.localeCompare(b.name)),
        exercises: state.exercises.map((exercise) =>
          ids.has(exercise.id)
            ? { ...exercise, skillIds: [...exercise.skillIds, skill.id] }
            : exercise,
        ),
      }));

      libraryRepository.saveSkill(skill);
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
      const skillIds = new Set(drill.skillIds ?? []);
      patchState(store, (state) => ({
        ...state,
        skills: state.skills.map((skill) =>
          skillIds.has(skill.id)
            ? { ...skill, exerciseIds: [...skill.exerciseIds, drill.id] }
            : skill,
        ),
        exercises: [
          ...state.exercises,
          {
            ...drill,
            stats: {
              lastPerformedAt: null,
              lastPerformedHoursAgo: null,
            },
          },
        ].toSorted((a, b) => a.name.localeCompare(b.name)),
      }));
      libraryRepository.saveDrill(drill);
    },

    updateDrill: (drill: UpsertExercisePayload) => {
      const drillIndex = store.exercises().findIndex((d) => d.id === drill.id);
      const existingDrill = store.exercises()[drillIndex];
      const updatedDrill = { ...existingDrill, ...drill };

      const removedSkillIds =
        existingDrill.skillIds?.filter((id) => !drill.skillIds?.includes(id)) ?? [];
      const addedSkillIds =
        drill.skillIds?.filter((id) => !existingDrill.skillIds?.includes(id)) ?? [];

      const skills = [...store.skills()];

      if (removedSkillIds.length) {
        skills.forEach((skill) => {
          if (removedSkillIds.includes(skill.id)) {
            skill.exerciseIds = skill.exerciseIds.filter((id) => id !== drill.id);
          }
        });
      }

      if (addedSkillIds.length) {
        skills.forEach((skill) => {
          if (addedSkillIds.includes(skill.id)) {
            skill.exerciseIds = [...skill.exerciseIds, drill.id];
          }
        });
      }

      patchState(store, (state) => ({
        ...state,
        skills,
        exercises: state.exercises.with(drillIndex, updatedDrill),
      }));
      libraryRepository.updateDrill(drill, removedSkillIds, addedSkillIds);
    },
  })),
  withHooks((store, drillRepository = inject(LibraryRepository)) => ({
    onInit: async () => {
      drillRepository.getAllSkills().then((skills) => {
        patchState(store, (state) => ({ ...state, skills }));
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
