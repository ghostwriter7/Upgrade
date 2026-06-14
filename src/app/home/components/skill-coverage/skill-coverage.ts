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
import { from, switchMap } from 'rxjs';
import { SkillCoverageService } from '@home/components/skill-coverage/service/skill-coverage.service';
import { ReplacePipe } from '@ui/pipes/replace-pipe';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-skill-coverage',
  templateUrl: './skill-coverage.html',
  providers: [SkillCoverageService],
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
  protected readonly displayedColumns: string[] = ['skill', 'count', 'daysAgo'];
  protected readonly queryOptions = queryOptions;
  private readonly activeOption = signal({ option: 30 });
  protected readonly form = form(this.activeOption);
  private readonly destroyRef = inject(DestroyRef);
  private readonly skillCoverageService = inject(SkillCoverageService);
  protected readonly skillCoverage = this.skillCoverageService.$skillCoverage;

  constructor() {
    toObservable(this.activeOption)
      .pipe(
        switchMap(({ option }) => from(this.skillCoverageService.computeCoverage(option))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected onSortChange(event: Sort): void {
    this.skillCoverageService.sortBy(event);
  }
}
