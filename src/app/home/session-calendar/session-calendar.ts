import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Temporal } from '@js-temporal/polyfill';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { SessionStore } from '../../store/session.store';
import { RouterLink } from '@angular/router';

interface CalendarCell {
  day: number | null;
  date: string;
  hasSessions?: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-calendar',
  imports: [MatIcon, MatMiniFabButton, RouterLink],
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
  private readonly sessionCountByDate = signal<Map<number, number>>(new Map());

  protected readonly label = computed(() =>
    this.firstDayOfMonth().toLocaleString('en-GB', { month: 'long', year: 'numeric' }),
  );
  protected readonly calendarCells = computed(() => {
    const firstDayOfWeek = this.firstDayOfWeek();

    const leadingEmptyCells = firstDayOfWeek - 1;

    const sessionCountByDate = this.sessionCountByDate();
    const { year, month } = this.activeYearAndMonth();
    const cells: CalendarCell[] = [];

    const {
      year: leadingYear,
      month: leadingMonth,
      daysInMonth: daysInLeadingMonth,
    } = this.firstDayOfMonth().subtract({ months: 1 });
    for (let i = 1; i <= leadingEmptyCells; i++) {
      cells.push({
        day: null,
        date: this.toDateString(
          leadingYear,
          leadingMonth,
          daysInLeadingMonth - leadingEmptyCells + i,
        ),
      });
    }

    for (let i = 1; i <= this.numberOfDaysInMonth(); i++) {
      cells.push({
        day: i,
        hasSessions: sessionCountByDate.has(i),
        date: this.toDateString(year, month, i),
      });
    }

    const {
      year: nextYear,
      month: nextMonth,
    } = this.firstDayOfMonth().add({ months: 1 });
    let nextDate = 1;
    while (cells.length % 7 !== 0) {
      cells.push({
        day: null,
        date: this.toDateString(nextYear, nextMonth, nextDate++),
      });
    }

    return cells;
  });

  private readonly sessionStore = inject(SessionStore);

  constructor() {
    effect(async () => {
      const { year, month } = this.activeYearAndMonth();
      const sessions = await this.sessionStore.getSessionsForMonthAndYear(month, year);
      const sessionCountByDate = sessions.reduce((lookup, session) => {
        const sessionDay = session.day;
        lookup.set(sessionDay, (lookup.get(sessionDay) ?? 0) + 1);
        return lookup;
      }, new Map<number, number>());
      this.sessionCountByDate.set(sessionCountByDate);
    });
  }

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
      if (prevMonth < 1)
        return {
          month: 12,
          year: year - 1,
        };
      return { year, month: prevMonth };
    });
  }

  private toDateString(year: number, month: number, date: number): string {
    return `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
  }
}
