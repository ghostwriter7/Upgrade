import { Component, computed, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ExerciseStore } from '../../../store/exercises.store';
import { Session } from '../../../domain/model/session/session.model';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';

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

  protected readonly hasNoneSelected = computed(() => this.selectedExerciseIds().length === 0);
  protected readonly selectedExerciseIds = signal<string[]>([]);
  private readonly activeExerciseIds = new Set(
    this.data.session.exercises.map(({ exerciseId }) => exerciseId),
  );
  protected readonly availableExercises = computed(() =>
    this.exerciseStore.exercises().filter(({ uuid }) => !this.activeExerciseIds.has(uuid)),
  );

  protected handleSelectionChange(selectionListChange: MatSelectionListChange): void {
    this.selectedExerciseIds.set(
      selectionListChange.source.selectedOptions.selected.map((option) => option.value),
    );
  }
}
