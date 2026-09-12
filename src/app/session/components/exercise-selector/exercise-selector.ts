import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ExerciseStore } from '@store/exercises.store';
import { Session } from '@domain/model/session/session.model';
import {
  MatDivider,
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { PrintHoursPipe } from '@ui/pipes/print-hours-pipe';
import { MatIcon } from '@angular/material/icon';
import { SkillStore } from '@store/skill.store';
import { NgClass, PercentPipe } from '@angular/common';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-exercise-selector',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatSelectionList,
    MatListOption,
    PrintHoursPipe,
    MatMiniFabButton,
    MatIcon,
    NgClass,
    MatDivider,
    MatChip,
    PercentPipe,
  ],
  templateUrl: './exercise-selector.html',
  styleUrl: './exercise-selector.css',
  host: {
    'data-testid': 'exercise-selector',
  },
})
export class ExerciseSelector {
  private readonly data: { session: Session } = inject(MAT_DIALOG_DATA);
  private readonly exerciseStore = inject(ExerciseStore);
  private readonly skillStore = inject(SkillStore);

  protected readonly activeSkill = computed(() => {
    const activeSkills = this.skillOptions().filter((s) => s.isSelected);
    return activeSkills.length === 1 ? activeSkills[0] : undefined;
  });

  protected readonly skillOptions = linkedSignal(() =>
    this.skillStore
      .skills()
      .map((skill) => ({ skill, isSelected: this.exerciseStore.activeSkill() === skill })),
  );
  protected readonly hasNoneSelected = computed(() => this.selectedExerciseIds().length === 0);
  protected readonly selectedExerciseIds = signal<string[]>([]);
  private readonly activeExerciseIds = new Set(
    this.data.session.exerciseLogs.map(({ exerciseId }) => exerciseId),
  );
  protected readonly availableExercises = computed(() => {
    const selectedSkills = this.skillOptions().filter((o) => o.isSelected);

    const drills = (
      selectedSkills.length === 0
        ? this.exerciseStore.exercises()
        : this.exerciseStore.getDrillsForSkills(selectedSkills.map((o) => o.skill))
    ).filter(({ id }) => !this.activeExerciseIds.has(id));

    const activeSort = this.sortOptions().find((option) => option.active)?.id;

    if (!activeSort) return drills;
    const order = this.sortDirection() === 'ASC' ? 1 : -1;

    const activeSkill = this.activeSkill()?.skill?.id;
    return drills.sort((a, b) => {
      if (activeSort === 'alphabetical') return order * a.name.localeCompare(b.name);
      if (activeSort === 'last-performed-at') {
        const lastPerformedAtA = a.stats?.lastPerformedAt?.epochMilliseconds ?? 0;
        const lastPerformedAtB = b.stats?.lastPerformedAt?.epochMilliseconds ?? 0;
        return order * (lastPerformedAtA - lastPerformedAtB);
      }
      if (activeSort === 'skill-score') {
        return order * ((a.skillScore[activeSkill!] ?? 0) - (b.skillScore[activeSkill!] ?? 0));
      }
      return 0;
    });
  });
  protected readonly showFilters = signal(false);
  protected readonly showSorting = signal(false);
  protected readonly sortOptions = signal([
    { icon: 'sort_by_alpha', id: 'alphabetical', active: false },
    { icon: 'history', id: 'last-performed-at', active: false },
    { icon: 'sports_score', id: 'skill-score', active: true },
  ]);
  protected readonly sortDirection = signal<'ASC' | 'DESC'>('DESC');
  protected readonly sortDirectionIcon = computed(() =>
    this.sortDirection() === 'ASC' ? 'arrow_upward' : 'arrow_downward',
  );

  protected handleSelectionChange(selectionListChange: MatSelectionListChange): void {
    this.selectedExerciseIds.set(
      selectionListChange.source.selectedOptions.selected.map((option) => option.value),
    );
  }

  protected toggleFilters(): void {
    this.showFilters.update((show) => !show);
  }

  protected toggleSorting(): void {
    this.showSorting.update((show) => !show);
  }

  protected toggleSkill(index: number): void {
    this.skillOptions.update((skillOptions) =>
      skillOptions.with(index, {
        ...skillOptions[index],
        isSelected: !skillOptions[index].isSelected,
      }),
    );
  }

  protected toggleSortOption(activeIndex: number): void {
    this.sortOptions.update((sortOptions) =>
      sortOptions.map((option, index) => ({ ...option, active: index === activeIndex })),
    );
  }

  protected toggleSortDirection(): void {
    this.sortDirection.update((dir) => (dir === 'ASC' ? 'DESC' : 'ASC'));
  }
}
