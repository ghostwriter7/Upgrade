import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HabitStore } from '../../store/habit.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-habit-stats',
  templateUrl: './habit-stats.html',
  styleUrl: './habit-stats.css',
})
export class HabitStats {
  private readonly habitStore = inject(HabitStore);

  protected readonly weekSlipCount = this.habitStore.weekSlipCount;
}
