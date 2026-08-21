import { signalStore, withComputed, withState } from '@ngrx/signals';
import { Skill } from '@domain/model/skill';
import { CapabilityDefinition } from '@domain/model/capability-definition';
import { capabilities } from '@store/capabilities.const';
import { computed } from '@angular/core';
import { skills } from '@store/skills/skills.const';

interface State {
  skills: Skill[];
  capabilities: CapabilityDefinition[];
}

const initialState: State = {
  skills,
  capabilities,
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
);
