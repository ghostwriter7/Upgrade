import { SkillTag } from '@domain/enum/skill-tag.enum';
import { capability, Skill } from '@domain/model/skill';
import { snakeToTitleCase } from '@common/helper/string/string.utils';

export const OneArmChinUp: Skill = {
  id: SkillTag.OneArmChinUp,
  name: snakeToTitleCase(SkillTag.OneArmChinUp),
  capabilities: [
    capability('vertical-pulling-strength', 1),
    capability('grip-and-hanging-strength', 0.8),
  ],
};
