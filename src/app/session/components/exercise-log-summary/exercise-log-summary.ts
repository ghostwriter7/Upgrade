import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { Lozenge } from '@ui/lozenge/lozenge';

@Component({
  selector: 'app-exercise-log-summary',
  imports: [Lozenge],
  templateUrl: './exercise-log-summary.html',
  styleUrl: './exercise-log-summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseLogSummary {
  public exerciseLog = input.required<ExerciseLog>();

  protected readonly setSummary = computed(() => this.exerciseLog().computeSetSummary());
}
