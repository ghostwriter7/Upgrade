export interface Habit {
  id: string;
  title: string;
  createdAt: Temporal.Instant;
  failures: Temporal.Instant[];
}

export type CreateHabitRequest = Pick<Habit, 'title'>;

export type UpdateHabitRequest = Pick<Habit, 'id' | 'title'>;

export type DayStatus = 'success' | 'failure' | 'future' | 'inactive';

export interface UiHabit extends Habit {
  streak: number;
  week: DayStatus[];
}
