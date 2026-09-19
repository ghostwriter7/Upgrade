import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Skill } from '@domain/model/skill';
import { computed, inject } from '@angular/core';
import { SkillRepository } from '@persistence/repository/skill.repository';

interface State {
  skills: Skill[];
}

const initialState: State = {
  skills: [],
};

export const SkillStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    skillsById: computed(() =>
      store
        .skills()
        .reduce((index, skill) => ({ ...index, [skill.id]: skill }), {} as Record<string, Skill>),
    ),
  })),

  withMethods((store, skillRepository = inject(SkillRepository)) => ({
    save: (skill: Skill, exerciseIds: string[]) => {
      // patchState()
    },
  })),

  withHooks((store, skillRepository = inject(SkillRepository)) => ({
    onInit: async () => {
      const skills = await skillRepository.getAll();

      patchState(store, (state) => ({
        ...state,
        skills: skills.toSorted((a, b) => a.name.localeCompare(b.name)),
      }));
    },
  })),
);
