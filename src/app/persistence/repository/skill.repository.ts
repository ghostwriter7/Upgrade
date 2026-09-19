import { Service } from '@angular/core';
import { Repository } from '@persistence/repository/repository';
import { SkillDto, SkillSchema } from '@persistence/schema/skill.schema';

@Service()
export class SkillRepository extends Repository {
  public async getAll(): Promise<SkillDto[]> {
    const results = await this.database.queryMany(`select id, name from skill`);
    return results.map((r) => SkillSchema.parse(r));
  }
}
