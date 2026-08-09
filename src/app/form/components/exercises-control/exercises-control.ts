import { Component, computed, forwardRef, inject, input, signal } from '@angular/core';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ExerciseStore } from '@store/exercises.store';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-exercises-control',
  imports: [MatListOption, MatSelectionList],
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
    this.exerciseStore.exercises().filter(({ id }) => !this.excludedExerciseIds().has(id)),
  );
  private onChange?: (value: string[]) => void;
  private onTouched?: () => void;

  protected handleSelectionChange(selectionListChange: MatSelectionListChange): void {
    const selectedIds = selectionListChange.source.selectedOptions.selected.map(
      (option) => option.value,
    );

    this.selectedIds.set(selectedIds);
    this.onChange?.(selectedIds);
    this.onTouched?.();
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
  }
}
