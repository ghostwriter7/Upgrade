import { Component, computed, input, output } from '@angular/core';
import { ExerciseOption } from './add-exercises.models';
import { EXERCISE_TYPE_LABELS } from '@domain/enum/exercise-types.enum';

/**
 * One selectable row. Purely presentational: the parent owns selection state.
 * Renders a native checkbox inside a <label>, so the whole row is the tap
 * target and keyboard and screen-reader behaviour come for free.
 */
@Component({
  selector: 'app-exercise-row',
  templateUrl: './exercise-row.component.html',
  styleUrl: './exercise-row.component.css',
})
export class ExerciseRowComponent {
  readonly exercise = input.required<ExerciseOption>();

  /** Ready-to-show text, e.g. "188 days ago" or "Never done". */
  readonly lastDoneText = input.required<string>();

  /** Tints the last-done text amber. */
  readonly overdue = input(false);

  /** 1-based position in the selection, or null when not selected. */
  readonly order = input<number | null>(null);

  /** Fires when the user taps the row (select or deselect). */
  readonly toggled = output<void>();

  protected readonly selected = computed(() => this.order() !== null);
  protected readonly typeLabel = computed(() => EXERCISE_TYPE_LABELS[this.exercise().type]);
}
