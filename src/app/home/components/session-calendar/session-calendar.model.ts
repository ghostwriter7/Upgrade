export interface CalendarCell {
  day: number | null;
  date: string;
  hasSessions?: boolean;
  maxRpe?: number;
  rpeClass?: string;
  testId: string;
}
