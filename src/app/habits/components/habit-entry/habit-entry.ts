import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { UiHabit } from '../../model/habit.interface';
import { HabitStore } from '../../store/habit.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-habit-entry',
  imports: [MatButton],
  templateUrl: './habit-entry.html',
  styleUrl: './habit-entry.css',
})
export class HabitEntry {
  public habit = input.required<UiHabit>();

  private readonly habitStore = inject(HabitStore);

  protected logSlip(): void {
    this.habitStore.logSlip(this.habit().id);
  }
}
