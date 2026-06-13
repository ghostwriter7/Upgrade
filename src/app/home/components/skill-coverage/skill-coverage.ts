import { Component, DestroyRef, inject, signal } from '@angular/core';
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
import { SkillCoverageService } from '@home/components/skill-coverage/service/skill-coverage.service';
import { SkillCoverageRecord } from '@home/components/skill-coverage/skill-coverage-record.interface';
import { ReplacePipe } from '@ui/pipes/replace-pipe';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';

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
    ReplacePipe,
    MatSortHeader,
    MatSort,
  ],
})
export class SkillCoverage {
  protected readonly displayedColumns: string[] = ['label', 'count', 'daysAgo'];
  protected readonly queryOptions = queryOptions;
  private readonly activeOption = signal({ option: 30 });
  protected readonly form = form(this.activeOption);
  protected readonly skillCoverage = signal<SkillCoverageRecord[]>([]);
  private readonly destroyRef = inject(DestroyRef);
  private readonly skillCoverageService = inject(SkillCoverageService);

  constructor() {
    toObservable(this.activeOption)
      .pipe(
        switchMap(({ option }) => from(this.skillCoverageService.fetchCoverage(option))),
        tap((records) => this.skillCoverage.set(records)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected onSortChange(event: Sort): void {
    const property = event.active as keyof Pick<SkillCoverageRecord, 'daysAgo' | 'count'>;
    const isAscending = event.direction === 'asc';
    this.skillCoverage.update((records) =>
      records.toSorted((a, b) =>
        isAscending ? a[property] - b[property] : b[property] - a[property],
      ),
    );
  }
}
