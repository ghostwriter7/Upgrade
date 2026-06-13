import { Skills } from '@domain/enum/skill-tag.enum';

export interface SkillCoverageRecord {
  count: number;
  lastDate?: Temporal.Instant;
  daysAgo: number;
  skill: Skills;
}
