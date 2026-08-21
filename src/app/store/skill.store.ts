import { signalStore, withComputed, withState } from '@ngrx/signals';
import { Skill, SkillCapability } from '@domain/model/skill';
import { SkillTag } from '@domain/enum/skill-tag.enum';
import { CapabilityDefinition } from '@domain/model/capability-definition';
import { capabilities, CapabilityId } from '@store/capabilities.const';
import { snakeToTitleCase } from '@common/helper/string/string.utils';
import { computed } from '@angular/core';

interface State {
  skills: Skill[];
  capabilities: CapabilityDefinition[];
}

const capability = (capabilityId: CapabilityId, importance: number): SkillCapability => ({
  capabilityId,
  importance,
});

const skills: Skill[] = [
  {
    id: SkillTag.Bridge,
    capabilities: [
      capability('shoulder-flexion', 1.0),
      capability('shoulder-external-rotation', 0.8),
      capability('thoracic-extension', 0.9),
      capability('hip-flexor-extensibility', 0.6),
    ],
  },
  {
    id: SkillTag.SideSplit,
    capabilities: [
      capability('adductor-extensibility', 1.0),
      capability('adductor-end-range-strength', 0.8),
    ],
  },
  {
    id: SkillTag.FrontSplit,
    capabilities: [
      capability('hip-flexor-extensibility', 1.0),
      capability('hamstring-extensibility', 1.0),
      capability('hamstring-end-range-strength', 0.7),
    ],
  },
  {
    id: SkillTag.Pancake,
    capabilities: [
      capability('adductor-extensibility', 1.0),
      capability('hamstring-extensibility', 0.9),
      capability('active-hip-flexion', 0.8),
      capability('adductor-end-range-strength', 0.6),
    ],
  },
  {
    id: SkillTag.Pike,
    capabilities: [
      capability('hamstring-extensibility', 1.0),
      capability('active-hip-flexion', 0.9),
      capability('hamstring-end-range-strength', 0.7),
    ],
  },
].map((skill) => ({ ...skill, name: snakeToTitleCase(skill.id) }));

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
