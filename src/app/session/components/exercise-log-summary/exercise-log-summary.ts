import { Component, computed, input } from '@angular/core';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { Lozenge } from '@ui/lozenge/lozenge';
import { formatSet } from '@domain/model/exercise-set/format-set';

@Component({
  selector: 'app-exercise-log-summary',
  imports: [Lozenge],
  templateUrl: './exercise-log-summary.html',
  styleUrl: './exercise-log-summary.css',
})
export class ExerciseLogSummary {
  public exerciseLog = input.required<ExerciseLog>();

  protected readonly setSummary = computed(() => {
    const log = this.exerciseLog();
    if (log.isEmpty) return [];

    const sets = log.sets;

    if (sets.length === 1) return [formatSet(sets[0])];

    if (log.hasAllEqualSets()) return [`${sets.length} x ${formatSet(sets[0])}`];

    return sets.map((set) => formatSet(set));
  });
}
