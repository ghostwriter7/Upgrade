import { Skills } from '@domain/enum/skill-tag.enum';

export interface SkillCoverage {
  count: number;
  lastDate?: Temporal.Instant;
}

export type SkillCoverageBySkill = Record<Skills, SkillCoverage>;
