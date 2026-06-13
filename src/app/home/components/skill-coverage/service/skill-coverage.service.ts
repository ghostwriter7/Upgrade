import { inject, Service } from '@angular/core';
import { SkillCoverageRecord } from '@home/components/skill-coverage/skill-coverage-record.interface';
import { QueryBus } from '@common/routers/query/query-bus';
import { Skills } from '@domain/enum/skill-tag.enum';
import { GetSkillCoverageQuery } from '@session/queries/get-skill-coverage/get-skill-coverage.query';
import { DateHelper } from '@common/helper/date.helper';
import { SkillCoverage } from '@session/queries/get-skill-coverage/skill-coverage.type';

@Service()
export class SkillCoverageService {
  private readonly queryBus = inject(QueryBus);

  public async fetchCoverage(fromDaysAgo: number): Promise<SkillCoverageRecord[]> {
    const now = DateHelper.now();
    const skillCoverage = await this.queryBus.execute(new GetSkillCoverageQuery(now, fromDaysAgo));

    return (Object.entries(skillCoverage) as [Skills, SkillCoverage][])
      .map(([skill, { count, lastDate }]) => ({
        skill,
        count,
        lastDate,
        daysAgo: this.computeDaysAgo(now, lastDate),
      }))
      .sort((a, b) => {
        const countDifference = b.count - a.count;
        if (countDifference !== 0) return countDifference;

        const daysDifference = a.daysAgo - b.daysAgo;
        if (daysDifference !== 0) return daysDifference;

        return a.skill.localeCompare(b.skill);
      });
  }

  private computeDaysAgo(now: Temporal.Instant, lastDate?: Temporal.Instant): number {
    return lastDate
      ? lastDate.until(now, { largestUnit: 'seconds' }).round({ largestUnit: 'days' }).days
      : -1;
  }
}
