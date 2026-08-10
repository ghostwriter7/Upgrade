import { Component, computed, forwardRef, inject, input, signal, viewChild } from '@angular/core';
import {
  MatList,
  MatListItem,
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { ExerciseStore } from '@store/exercises.store';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ExerciseNamePipe } from '@ui/pipes/exercise-name-pipe';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-exercises-control',
  imports: [
    MatListOption,
    MatSelectionList,
    MatList,
    MatListItem,
    ExerciseNamePipe,
    CdkDropList,
    CdkDrag,
    MatIcon,
  ],
  templateUrl: './exercises-control.html',
  styleUrl: './exercises-control.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ExercisesControl),
    },
  ],
})
export class ExercisesControl implements ControlValueAccessor {
  public excludedExerciseIds = input<Set<string>>(new Set());

  private readonly exerciseStore = inject(ExerciseStore);
  protected readonly selectedIds = signal<string[]>([]);
  protected readonly disabled = signal(false);

  protected readonly visibleExercises = computed(() =>
    this.exerciseStore
      .exercises()
      .filter(({ id }) => !this.excludedExerciseIds().has(id) && !this.selectedIds().includes(id)),
  );
  private onChange?: (value: string[]) => void;
  private onTouched?: () => void;
  private readonly selectionList = viewChild.required(MatSelectionList);

  protected handleSelectionChange(selectionListChange: MatSelectionListChange): void {
    const selectedIds = selectionListChange.source.selectedOptions.selected.map(
      (option) => option.value,
    );

    this.selectedIds.update((ids) => [...ids, ...selectedIds]);
    this.notify();
  }

  public registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  public writeValue(ids: string[] = []): void {
    this.selectedIds.set(ids);
    this.selectionList().writeValue(ids);
  }

  protected onDrop($event: CdkDragDrop<any, any>): void {
    const { previousIndex, currentIndex } = $event;
    this.selectedIds.update((ids) => {
      const [item] = ids.splice(previousIndex, 1);
      return ids.toSpliced(currentIndex, 0, item);
    });
    this.notify();
  }

  protected remove(index: number): void {
    this.selectedIds.update((ids) => ids.toSpliced(index, 1));
    this.notify();
  }

  private notify(): void {
    this.onChange?.(this.selectedIds());
    this.onTouched?.();
  }
}
