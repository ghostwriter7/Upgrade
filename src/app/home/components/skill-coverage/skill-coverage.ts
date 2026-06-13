import { Component, DestroyRef, inject, signal } from '@angular/core';
import { QueryBus } from '@common/routers/query/query-bus';
import { DateHelper } from '@common/helper/date.helper';
import { GetSkillCoverageQuery } from '@session/queries/get-skill-coverage/get-skill-coverage.query';
import { Skills } from '@domain/enum/skill-tag.enum';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { queryOptions } from './query-options.const';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { form, FormField } from '@angular/forms/signals';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { from, switchMap, tap } from 'rxjs';

interface SkillCoverageRecord {
  count: number;
  lastDate?: Temporal.Instant;
  daysAgo: number | 'Never';
  skill: Skills;
  label: string;
}

@Component({
  selector: 'app-skill-coverage',
  templateUrl: './skill-coverage.html',
  styleUrl: './skill-coverage.css',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatHeaderRowDef,
    TitleCasePipe,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormField,
  ],
})
export class SkillCoverage {
  private readonly queryBus = inject(QueryBus);
  protected readonly displayedColumns: string[] = ['label', 'count', 'daysAgo'];
  protected readonly queryOptions = queryOptions;
  protected readonly activeOption = signal({ option: 30 });
  protected readonly form = form(this.activeOption);
  protected readonly skillCoverage = signal<SkillCoverageRecord[]>([]);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const now = DateHelper.now();

    toObservable(this.activeOption)
      .pipe(
        switchMap(({ option }) =>
          from(this.queryBus.execute(new GetSkillCoverageQuery(now, option))),
        ),
        tap((skillCoverage) => {
          const records: SkillCoverageRecord[] = Object.entries(skillCoverage)
            .map(([skill, { count, lastDate }]) => ({
              skill: skill as Skills,
              count,
              lastDate,
              daysAgo: lastDate
                ? lastDate.until(now, { largestUnit: 'seconds' }).round({ largestUnit: 'days' })
                    .days
                : ('Never' as const),
              label: skill.replaceAll('_', ' '),
            }))
            .sort((a, b) => b.count - a.count);

          this.skillCoverage.set(records);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
