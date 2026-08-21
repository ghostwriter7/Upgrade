import { SkillTag } from '@domain/enum/skill-tag.enum';
import { capability, Skill } from '@domain/model/skill';
import { snakeToTitleCase } from '@common/helper/string/string.utils';

export const FrontSplit: Skill = {
  id: SkillTag.FrontSplit,
  name: snakeToTitleCase(SkillTag.FrontSplit),
  capabilities: [
    capability('hip-flexor-extensibility', 1.0),
    capability('hamstring-extensibility', 1.0),
    capability('hamstring-end-range-strength', 0.7),
  ],
};
