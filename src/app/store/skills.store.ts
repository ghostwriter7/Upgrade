import { isSkill, Skill } from '../model/skill.model';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { effect, inject } from '@angular/core';
import { PersistenceService } from '../common/service/persistence.service';

interface State {
  skills: Skill[];
}

const initialState: State = {
  skills: [],
};

export const SkillStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    getSkillById: (uuid: string) => store.skills().find((skill) => skill.uuid === uuid),
  })),
  withMethods((store) => {
    const getSkillIndex = (uuid: string): number =>
      store.skills().findIndex((skill) => skill.uuid === uuid);

    return {
      create: (skill: Skill) =>
        patchState(store, (state) => ({
          ...state,
          skills: [...state.skills, skill].sort((a, b) => a.name.localeCompare(b.name)),
        })),
      update: (skill: Skill) => {
        const existingSkillIndex = getSkillIndex(skill.uuid);

        if (existingSkillIndex === -1) throw new Error(`Skill with UUID ${skill.uuid} not found`);

        const existingSkill = store.skills()[existingSkillIndex];
        patchState(store, (state) => ({
          ...state,
          skills: state.skills.with(existingSkillIndex, {
            ...existingSkill,
            ...skill,
          }),
        }));
      },
    };
  }),
  withHooks((store, persistence = inject(PersistenceService)) => ({
    onInit: () => {
      const skills = persistence.retrieve('skills');

      if (Array.isArray(skills) && skills.every(isSkill)) {
        patchState(store, { skills });
      }

      effect(() => {
        const skills = store.skills();
        persistence.persist('skills', skills);
      });
    }
  }))
);
