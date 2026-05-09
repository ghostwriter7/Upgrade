import { isSkill, Skill } from '../model/skill.model';
import { createUuid } from '../../common/function/create-uuid.function';

export class SkillFactory {
  public static createNew(name: string,
                          description: string | null,
                          exerciseIds: string[],
                          prerequisiteSkillIds: string[]): Skill {
    return new Skill(createUuid(), name, description, new Date().toISOString(), null, prerequisiteSkillIds, exerciseIds);
  }

  public static fromJSON(input: object): Skill {
    if (!isSkill(input)) throw new Error('Invalid input.');

    return new Skill(input.uuid, input.name, input.description, input.createdAt, input.updatedAt);
  }
}
