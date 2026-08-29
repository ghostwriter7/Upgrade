import { SkillTag } from '@domain/enum/skill-tag.enum';
import { capability, Skill } from '@domain/model/skill';
import { snakeToTitleCase } from '@common/helper/string/string.utils';

export const SideSplit: Skill = {
  id: SkillTag.SideSplit,
  name: snakeToTitleCase(SkillTag.SideSplit),
  capabilities: [capability('adductor-extensibility', 1.0), capability('abductors-strength', 0.9)],
};
