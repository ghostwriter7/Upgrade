import { SkillTag } from '@domain/enum/skill-tag.enum';
import { capability, Skill } from '@domain/model/skill';
import { snakeToTitleCase } from '@common/helper/string/string.utils';

export const Pancake: Skill = {
  id: SkillTag.Pancake,
  name: snakeToTitleCase(SkillTag.Pancake),
  capabilities: [
    capability('adductor-extensibility', 1.0),
    capability('hamstring-extensibility', 0.9),
    capability('active-hip-flexion', 0.8),
    capability('adductor-end-range-strength', 0.6),
  ],
};
