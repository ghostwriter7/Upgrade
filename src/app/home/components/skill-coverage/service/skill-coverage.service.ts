import { inject, Service, signal } from '@angular/core';
import { SkillCoverageRecord } from '@home/components/skill-coverage/skill-coverage-record.interface';
import { QueryBus } from '@common/routers/query/query-bus';
import { Skills } from '@domain/enum/skill-tag.enum';
import { GetSkillCoverageQuery } from '@session/queries/get-skill-coverage/get-skill-coverage.query';
import { DateHelper } from '@common/helper/date.helper';
import { SkillCoverage } from '@session/queries/get-skill-coverage/skill-coverage.type';
import { Sort } from '@angular/material/sort';

@Service({ autoProvided: false })
export class SkillCoverageService {
  private readonly queryBus = inject(QueryBus);

  private readonly skillCoverage = signal<SkillCoverageRecord[]>([]);
  public readonly $skillCoverage = this.skillCoverage.asReadonly();
  private readonly validSortProperties: (keyof SkillCoverageRecord)[] = [
    'skill',
    'count',
    'daysAgo',
  ];

  public async computeCoverage(fromDaysAgo: number): Promise<void> {
    const now = DateHelper.now();
    const skillCoverage = await this.queryBus.execute(new GetSkillCoverageQuery(now, fromDaysAgo));

    const skillCoverageRecords = (Object.entries(skillCoverage) as [Skills, SkillCoverage][])
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

    this.skillCoverage.set(skillCoverageRecords);
  }

  public sortBy({ active, direction }: Sort): void {
    if (this.validateSortProperty(active)) {
      const isAscending = direction === 'asc';

      this.skillCoverage.update((records) =>
        records.toSorted((a, b) => {
          switch (active) {
            case 'count':
            case 'daysAgo': {
              const difference = this.compareNumbers(a[active], b[active], isAscending);
              if (difference !== 0) return difference;
              return a.skill.localeCompare(b.skill);
            }
            case 'skill':
              return isAscending ? a.skill.localeCompare(b.skill) : b.skill.localeCompare(a.skill);
          }
        }),
      );
    }
  }

  private validateSortProperty(
    property: string,
  ): property is keyof Pick<SkillCoverageRecord, 'daysAgo' | 'count' | 'skill'> {
    if ((this.validSortProperties as string[]).includes(property)) return true;

    throw new Error(`Property "${property}" is not valid for sorting.`);
  }

  private computeDaysAgo(now: Temporal.Instant, lastDate?: Temporal.Instant): number {
    return lastDate
      ? lastDate.until(now, { largestUnit: 'seconds' }).round({ largestUnit: 'days' }).days
      : -1;
  }

  private compareNumbers(valueA: number, valueB: number, isAscending: boolean): number {
    return isAscending ? valueA - valueB : valueB - valueA;
  }
}
