export interface Dont {
  id: string;
  title: string;
  createdAt: Temporal.Instant;
  failures: Temporal.Instant[];
}

export type CreateDontRequest = Pick<Dont, 'title'>;

export type UpdateDontRequest = Pick<Dont, 'id' | 'title'>;

export type DayStatus = 'success' | 'failure' | 'future' | 'inactive';

export interface UiDont extends Dont {
  streak: number;
  week: DayStatus[];
}
