import { capability, Skill } from '@domain/model/skill';
import { SkillTag } from '@domain/enum/skill-tag.enum';
import { snakeToTitleCase } from '@common/helper/string/string.utils';

export const Pike: Skill = {
  id: SkillTag.Pike,
  name: snakeToTitleCase(SkillTag.Pike),
  capabilities: [
    capability('hamstring-extensibility', 1.0),
    capability('active-hip-flexion', 0.9),
    capability('hamstring-end-range-strength', 0.7),
  ],
};
