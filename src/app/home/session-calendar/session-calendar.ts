import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { Temporal } from '@js-temporal/polyfill';

interface CalendarCell {
  day: number | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-calendar',
  imports: [],
  templateUrl: './session-calendar.html',
  styleUrl: './session-calendar.css',
})
export class SessionCalendar {
  private readonly activeYear = signal(Temporal.Now.plainDateISO().year);
  private readonly activeMonth = signal(Temporal.Now.plainDateISO().month);

  private readonly firstDayOfMonth = computed(() =>
    Temporal.PlainDate.from({ year: this.activeYear(), month: this.activeMonth(), day: 1 }),
  );
  private readonly firstDayOfWeek = computed(() => this.firstDayOfMonth().dayOfWeek);
  private readonly numberOfDaysInMonth = computed(() => this.firstDayOfMonth().daysInMonth);

  protected readonly calendarCells = computed(() => {
    const firstDayOfWeek = this.firstDayOfWeek();

    const leadingEmptyCells = firstDayOfWeek - 1;

    const cells: CalendarCell[] = [];

    for (let i = 0; i < leadingEmptyCells; i++) {
      cells.push({ day: null });
    }

    for (let i = 1; i <= this.numberOfDaysInMonth(); i++) {
      cells.push({ day: i });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ day: null });
    }

    return cells;
  });
}
