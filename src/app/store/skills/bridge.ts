import { SkillTag } from '@domain/enum/skill-tag.enum';
import { capability, Skill } from '@domain/model/skill';
import { snakeToTitleCase } from '@common/helper/string/string.utils';

export const Bridge: Skill = {
  id: SkillTag.Bridge,
  name: snakeToTitleCase(SkillTag.Bridge),
  capabilities: [
    capability('shoulder-flexion', 1.0),
    capability('shoulder-external-rotation', 0.8),
    capability('thoracic-extension', 0.9),
    capability('hip-flexor-extensibility', 0.6),
  ],
};
