import { signalStore, withState } from '@ngrx/signals';
import { Skill, SkillCapability } from '@domain/model/skill';
import { SkillTag } from '@domain/enum/skill-tag.enum';
import { CapabilityDefinition } from '@domain/model/capability-definition';
import { capabilities, CapabilityId } from '@store/capabilities.const';

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
    name: SkillTag.Bridge,
    capabilities: [
      capability('shoulder-flexion', 1.0),
      capability('shoulder-external-rotation', 0.8),
      capability('thoracic-extension', 0.9),
      capability('hip-flexor-extensibility', 0.6),
    ],
  },
  {
    name: SkillTag.SideSplit,
    capabilities: [
      capability('adductor-extensibility', 1.0),
      capability('adductor-end-range-strength', 0.8),
    ],
  },
  {
    name: SkillTag.FrontSplit,
    capabilities: [
      capability('hip-flexor-extensibility', 1.0),
      capability('hamstring-extensibility', 1.0),
      capability('hamstring-end-range-strength', 0.7),
    ],
  },
  {
    name: SkillTag.Pancake,
    capabilities: [
      capability('adductor-extensibility', 1.0),
      capability('hamstring-extensibility', 0.9),
      capability('active-hip-flexion', 0.8),
      capability('adductor-end-range-strength', 0.6),
    ],
  },
  {
    name: SkillTag.Pike,
    capabilities: [
      capability('hamstring-extensibility', 1.0),
      capability('active-hip-flexion', 0.9),
      capability('hamstring-end-range-strength', 0.7),
    ],
  },
];

const initialState: State = {
  skills,
  capabilities,
};

export const SkillStore = signalStore({ providedIn: 'root' }, withState(initialState));
