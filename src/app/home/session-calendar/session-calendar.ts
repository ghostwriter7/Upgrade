import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Temporal } from '@js-temporal/polyfill';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';

interface CalendarCell {
  day: number | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-calendar',
  imports: [MatIcon, MatMiniFabButton],
  templateUrl: './session-calendar.html',
  styleUrl: './session-calendar.css',
})
export class SessionCalendar {
  private readonly activeYearAndMonth = signal({
    year: Temporal.Now.plainDateISO().year,
    month: Temporal.Now.plainDateISO().month,
  });

  private readonly firstDayOfMonth = computed(() => {
    const { year, month } = this.activeYearAndMonth();
    return Temporal.PlainDate.from({ year, month, day: 1 });
  });
  private readonly firstDayOfWeek = computed(() => this.firstDayOfMonth().dayOfWeek);
  private readonly numberOfDaysInMonth = computed(() => this.firstDayOfMonth().daysInMonth);

  protected readonly label = computed(() =>
    this.firstDayOfMonth().toLocaleString('en-GB', { month: 'long', year: 'numeric' }),
  );
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

  protected showNextMonth(): void {
    this.activeYearAndMonth.update(({ year, month }) => {
      const nextMonth = month + 1;
      if (nextMonth > 12)
        return {
          year: year + 1,
          month: 1,
        };
      return { year, month: nextMonth };
    });
  }

  protected showPreviousMonth(): void {
    this.activeYearAndMonth.update(({ year, month }) => {
      const prevMonth = month - 1;
      if (prevMonth < 1) return {
        month: 12,
        year: year - 1
      };
      return { year, month: prevMonth };
    });
  }
}
