import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
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
import { NgClass, TitleCasePipe } from '@angular/common';
import { queryOptions } from './query-options.const';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { form, FormField } from '@angular/forms/signals';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { from, switchMap } from 'rxjs';
import { SkillCoverageService } from '@home/components/skill-coverage/service/skill-coverage.service';
import { ReplacePipe } from '@ui/pipes/replace-pipe';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { SkillCoverageRecord } from '@home/components/skill-coverage/skill-coverage-record.interface';

interface EnhancedSkillCoverageRecord extends SkillCoverageRecord {
  countClass: string;
  daysAgoClass: string;
}

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
    NgClass,
  ],
})
export class SkillCoverage {
  protected readonly displayedColumns: string[] = ['skill', 'count', 'daysAgo'];
  protected readonly queryOptions = queryOptions;
  private readonly activeOption = signal({ option: 30 });
  protected readonly form = form(this.activeOption);
  private readonly destroyRef = inject(DestroyRef);
  private readonly skillCoverageService = inject(SkillCoverageService);
  protected readonly skillCoverage = computed<EnhancedSkillCoverageRecord[]>(() => {
    const skillCoverageRecords = this.skillCoverageService.$skillCoverage();

    return skillCoverageRecords.map((r) => ({
      ...r,
      countClass: this.getClass(r.metrics.countScore),
      daysAgoClass: this.getClass(r.metrics.recencyScore, true),
    }));
  });

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

  private getClass(score: number, invert = false): string {
    const s = invert ? 1 - score : score;

    if (s > 0.75) return 'heat-high';
    if (s > 0.5) return 'heat-mid-high';
    if (s > 0.25) return 'heat-mid';
    return 'heat-low';
  }
}
