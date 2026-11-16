import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HabitHeader } from '../habit-header/habit-header';
import { HabitStats } from '../habit-stats/habit-stats';
import { HabitEntry } from '../habit-entry/habit-entry';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HabitForm } from '../habit-form/habit-form';
import { HabitStore } from '../../store/habit.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-habit-page',
  imports: [HabitHeader, HabitStats, HabitEntry, MatButton, FormsModule, HabitForm],
  templateUrl: './habit-page.html',
  styleUrl: './habit-page.css',
  host: {
    class: 'page',
  },
})
export default class HabitPage {
  private readonly habitStore = inject(HabitStore);
  protected readonly habits = this.habitStore.uiHabits;

  protected onCreateNew(title: string): void {
    this.habitStore.create({ title });
  }
}
