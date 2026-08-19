import { computed, DestroyRef, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { SessionStore } from '@store/session/session.store';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { from, switchMap, tap } from 'rxjs';
import { pad } from '@common/function/pad-time.function';
import { CalendarCell } from './session-calendar.model';
import { Session } from '@domain/model/session/session.model';

@Injectable({ providedIn: 'root' })
export class SessionCalendarService {
  private readonly activeYearAndMonth = signal({
    year: Temporal.Now.plainDateISO().year,
    month: Temporal.Now.plainDateISO().month,
  });

  public readonly $firstDayOfMonth = computed(() => {
    const { year, month } = this.activeYearAndMonth();
    return Temporal.PlainDate.from({ year, month, day: 1 });
  });
  private readonly firstDayOfWeek = computed(() => this.$firstDayOfMonth().dayOfWeek);
  private readonly numberOfDaysInMonth = computed(() => this.$firstDayOfMonth().daysInMonth);
  private readonly sessionsByDay = signal<Record<number, Session[]>>({});

  public readonly $calendarCells = computed<CalendarCell[]>(() => {
    const firstDayOfWeek = this.firstDayOfWeek();

    const leadingEmptyCells = firstDayOfWeek - 1;

    const sessionsByDate = this.sessionsByDay();
    const { year, month } = this.activeYearAndMonth();
    const cells: Omit<CalendarCell, 'testId'>[] = [];

    const {
      year: leadingYear,
      month: leadingMonth,
      daysInMonth: daysInLeadingMonth,
    } = this.$firstDayOfMonth().subtract({ months: 1 });
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
      const sessions = sessionsByDate[i];
      const maxRpe = sessions
        ?.filter(({ rpe }) => rpe !== undefined)
        .reduce((max, { rpe }) => Math.max(max, rpe as number), 0);
      const rpeClass = maxRpe ? this.computeClass(maxRpe) : undefined;
      cells.push({
        day: i,
        hasSessions: !!sessions?.length,
        maxRpe,
        rpeClass,
        date: this.toDateString(year, month, i),
      });
    }

    const { year: nextYear, month: nextMonth } = this.$firstDayOfMonth().add({ months: 1 });
    let nextDate = 1;
    while (cells.length % 7 !== 0) {
      cells.push({
        day: null,
        date: this.toDateString(nextYear, nextMonth, nextDate++),
      });
    }

    return cells.map((cell) => ({ ...cell, testId: `session-calendar-cell-${cell.day}` }));
  });

  private readonly sessionStore = inject(SessionStore);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const sessionsByMonthAndYear = this.sessionStore.sessionsByMonthAndYear();
      const { year, month } = this.activeYearAndMonth();
      const monthlySessions = sessionsByMonthAndYear[`${year}-${month}`] ?? {};

      untracked(() => this.sessionsByDay.set(monthlySessions));
    });

    toObservable(this.activeYearAndMonth)
      .pipe(
        switchMap(({ year, month }) =>
          from(this.sessionStore.getSessionsByMonthAndYear(month, year)),
        ),
        tap((sessionCountByDate) => this.sessionsByDay.set(sessionCountByDate)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public showNextMonth(): void {
    this.activeYearAndMonth.update(({ year, month }) => {
      const firstDayOfNextMonth = Temporal.PlainDate.from({ year, month, day: 1 }).add({
        months: 1,
      });
      return { year: firstDayOfNextMonth.year, month: firstDayOfNextMonth.month };
    });
  }

  public showPreviousMonth(): void {
    this.activeYearAndMonth.update(({ year, month }) => {
      const firstDayOfPrevMonth = Temporal.PlainDate.from({ year, month, day: 1 }).subtract({
        months: 1,
      });
      return { year: firstDayOfPrevMonth.year, month: firstDayOfPrevMonth.month };
    });
  }

  private toDateString(year: number, month: number, day: number): string {
    return `${year}-${pad(month)}-${pad(day)}`;
  }

  private computeClass(rpe: number): string {
    if (rpe < 3) return 'very-soft';
    if (rpe < 5) return 'soft';
    if (rpe < 7) return 'mid';
    if (rpe < 9) return 'hard';
    return 'very-hard';
  }
}
