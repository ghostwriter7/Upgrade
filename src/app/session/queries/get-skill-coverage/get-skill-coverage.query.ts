import { Query } from '@common/routers/query/query.model';
import { SkillCoverageBySkill } from '@session/queries/get-skill-coverage/skill-coverage.type';

export class GetSkillCoverageQuery extends Query<SkillCoverageBySkill> {
  constructor(
    public readonly endDate: Temporal.Instant,
    public readonly lastDays = 30,
  ) {
    super();
  }
}
