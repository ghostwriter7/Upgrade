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
  MatListItemLine,
  MatListItemTitle,
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { PrintHoursPipe } from '@ui/pipes/print-hours-pipe';
import { MatIcon } from '@angular/material/icon';
import { SkillStore } from '@store/skill.store';
import { NgClass } from '@angular/common';

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
    MatListItemTitle,
    MatListItemLine,
    PrintHoursPipe,
    MatMiniFabButton,
    MatIcon,
    NgClass,
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

  protected readonly skillOptions = linkedSignal(() =>
    this.skillStore.skills().map((skill) => ({ skill, isSelected: false })),
  );
  protected readonly hasNoneSelected = computed(() => this.selectedExerciseIds().length === 0);
  protected readonly selectedExerciseIds = signal<string[]>([]);
  private readonly activeExerciseIds = new Set(
    this.data.session.exercises.map(({ exerciseId }) => exerciseId),
  );
  protected readonly availableExercises = computed(() => {
    const selectedSkills = this.skillOptions().filter((o) => o.isSelected);

    if (selectedSkills.length === 0)
      return this.exerciseStore.exercises().filter(({ id }) => !this.activeExerciseIds.has(id));

    return this.exerciseStore.getDrillsForSkills(selectedSkills.map((o) => o.skill));
  });
  protected readonly showFilters = signal(false);

  protected handleSelectionChange(selectionListChange: MatSelectionListChange): void {
    this.selectedExerciseIds.set(
      selectionListChange.source.selectedOptions.selected.map((option) => option.value),
    );
  }

  protected toggleFilters(): void {
    this.showFilters.update((show) => !show);
  }

  protected toggleSkill(index: number): void {
    this.skillOptions.update((skillOptions) =>
      skillOptions.with(index, {
        ...skillOptions[index],
        isSelected: !skillOptions[index].isSelected,
      }),
    );
  }
}
